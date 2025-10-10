import { useState, useEffect } from "react";
import axios from "axios";
import { Copy, RefreshCw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function DataKolomA() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSheetData = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const response = await axios.get(`${API}/sheets/data`);
      setData(response.data.data);
      setLastUpdated(new Date(response.data.last_updated).toLocaleString('id-ID'));
      
      if (isManualRefresh) {
        toast.success("Data berhasil diperbarui!");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Gagal memuat data dari spreadsheet");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const copyToClipboard = async (value, index) => {
    let copySuccess = false;
    
    // Method 1: Modern Clipboard API
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(value);
        copySuccess = true;
      }
    } catch (err) {
      console.log("Clipboard API failed, trying fallback...", err);
    }
    
    // Method 2: Fallback using textarea and execCommand
    if (!copySuccess) {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = value;
        
        textArea.style.position = "fixed";
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.width = "2em";
        textArea.style.height = "2em";
        textArea.style.padding = "0";
        textArea.style.border = "none";
        textArea.style.outline = "none";
        textArea.style.boxShadow = "none";
        textArea.style.background = "transparent";
        textArea.setAttribute('readonly', '');
        
        document.body.appendChild(textArea);
        
        if (navigator.userAgent.match(/ipad|iphone/i)) {
          const range = document.createRange();
          range.selectNodeContents(textArea);
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
          textArea.setSelectionRange(0, 999999);
        } else {
          textArea.focus();
          textArea.select();
        }
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          copySuccess = true;
        }
      } catch (err) {
        console.log("Fallback method failed", err);
      }
    }
    
    // Method 3: Create a temporary input element
    if (!copySuccess) {
      try {
        const input = document.createElement("input");
        input.value = value;
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.appendChild(input);
        input.focus();
        input.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(input);
        
        if (successful) {
          copySuccess = true;
        }
      } catch (err) {
        console.log("Input method failed", err);
      }
    }
    
    if (copySuccess) {
      setCopiedIndex(index);
      toast.success("✓ Berhasil disalin!", {
        description: `Data sudah tersimpan di clipboard`,
        duration: 2000
      });
      
      setTimeout(() => {
        setCopiedIndex(null);
      }, 2000);
    } else {
      toast.error("Gagal menyalin otomatis", {
        description: "Tap dan tahan pada teks untuk copy manual",
        duration: 3000
      });
    }
  };

  useEffect(() => {
    fetchSheetData();
    
    const interval = setInterval(() => {
      fetchSheetData();
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg font-medium">Memuat data dari spreadsheet...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Data Kolom A <span className="text-emerald-600">({data.length} item)</span>
          </h2>
          {lastUpdated && (
            <p className="text-sm text-slate-500 mt-1">
              Update: <span className="font-medium text-slate-700">{lastUpdated}</span>
            </p>
          )}
        </div>
        
        <Button
          onClick={() => fetchSheetData(true)}
          disabled={refreshing}
          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
          data-testid="refresh-button"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{refreshing ? 'Memperbarui...' : 'Perbarui'}</span>
        </Button>
      </div>

      {data.length === 0 ? (
        <Card className="p-8 sm:p-12 text-center bg-white/60 backdrop-blur-sm border-slate-200">
          <div className="text-slate-400 mb-4">
            <svg className="mx-auto h-12 w-12 sm:h-16 sm:w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-slate-700 mb-2">Tidak ada data</h3>
          <p className="text-sm sm:text-base text-slate-500">Belum ada data di kolom A spreadsheet</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {data.map((item, index) => (
            <Card
              key={item.index}
              className="group relative overflow-hidden bg-white hover:shadow-xl active:shadow-2xl transition-all duration-300 border-slate-200 hover:border-emerald-300 active:scale-[0.98]"
              data-testid={`data-card-${index}`}
            >
              <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 bg-emerald-100 text-emerald-700 text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                {item.cell_id}
              </div>
              
              <div className="p-4 sm:p-6 pt-10 sm:pt-12">
                <div className="mb-3 sm:mb-4 relative group/text">
                  <div 
                    className="text-base sm:text-lg font-bold text-slate-800 break-words whitespace-pre-line leading-relaxed select-all cursor-text bg-slate-50 p-3 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    title="Tap dan tahan untuk copy manual"
                  >
                    {item.value}
                  </div>
                  <div className="absolute top-1 right-1 opacity-0 group-hover/text:opacity-100 transition-opacity pointer-events-none">
                    <span className="text-[10px] text-slate-400 bg-white px-1.5 py-0.5 rounded">Tap & hold</span>
                  </div>
                </div>
                
                <Button
                  onClick={() => copyToClipboard(item.value, item.index)}
                  className={`w-full transition-all duration-300 touch-manipulation h-11 sm:h-10 text-sm sm:text-base ${
                    copiedIndex === item.index
                      ? 'bg-green-600 hover:bg-green-700 active:bg-green-800'
                      : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800'
                  } text-white gap-2 shadow-md active:shadow-lg`}
                  data-testid={`copy-button-${index}`}
                >
                  {copiedIndex === item.index ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 sm:h-4 sm:w-4" />
                      <span className="font-medium">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 sm:h-4 sm:w-4" />
                      <span className="font-medium">Salin Data</span>
                    </>
                  )}
                </Button>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-all duration-300 pointer-events-none"></div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
