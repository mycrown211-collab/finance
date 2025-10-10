from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone
import requests
import csv
import io


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Google Sheets Configuration
SPREADSHEET_ID = "1Zzkt2hn8BSYixGf22E9qrQo6F5BIc9LeNInnpAiVr1Q"
SHEET_NAME = "database"


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class SheetDataResponse(BaseModel):
    data: List[dict]
    total: int
    last_updated: str


# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Google Sheets Sync API"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


@api_router.get("/sheets/data", response_model=SheetDataResponse)
async def get_sheet_data():
    """
    Fetch data from Google Sheets and return column A data
    Only return rows where column A = "1" or is filled
    """
    try:
        # Construct the CSV export URL
        csv_url = f"https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/export?format=csv&gid=0"
        
        # Fetch the CSV data
        response = requests.get(csv_url, timeout=10)
        response.raise_for_status()
        
        # Parse CSV
        csv_content = response.content.decode('utf-8')
        csv_reader = csv.reader(io.StringIO(csv_content))
        
        # Extract column A data
        result_data = []
        row_index = 0
        
        for row in csv_reader:
            row_index += 1
            if row and len(row) > 0:
                column_a_value = row[0].strip()
                
                # Include if column A has "1" or any non-empty value
                if column_a_value:  # This includes "1" and any other filled values
                    result_data.append({
                        "index": row_index,
                        "cell_id": f"A{row_index}",
                        "value": column_a_value
                    })
        
        return SheetDataResponse(
            data=result_data,
            total=len(result_data),
            last_updated=datetime.now(timezone.utc).isoformat()
        )
    
    except requests.RequestException as e:
        logger.error(f"Error fetching Google Sheets data: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail=f"Failed to fetch data from Google Sheets: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()