import { useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { Database, MessageSquare } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import DataKolomA from "@/pages/DataKolomA";
import TemplateChat from "@/pages/TemplateChat";

function Navigation() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="border-b border-slate-200 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
          <Link
            to="/"
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 border-b-2 transition-all whitespace-nowrap touch-manipulation ${
              isActive('/')
                ? 'border-emerald-600 text-emerald-700 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <Database className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-sm sm:text-base">Data Kolom A</span>
          </Link>
          
          <Link
            to="/template-chat"
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 border-b-2 transition-all whitespace-nowrap touch-manipulation ${
              isActive('/template-chat')
                ? 'border-blue-600 text-blue-700 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-sm sm:text-base">Template Chat</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

function AppContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 truncate" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Google Sheets Sync
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Data realtime dari spreadsheet</p>
            </div>
            
            <Button
              onClick={() => fetchSheetData(true)}
              disabled={refreshing}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shrink-0 text-sm sm:text-base h-9 sm:h-10 px-3 sm:px-4"
              data-testid="refresh-button"
            >
              <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden xs:inline">{refreshing ? 'Memperbarui...' : 'Perbarui'}</span>
              <span className="xs:hidden">⟳</span>
            </Button>
          </div>
          
          {lastUpdated && (
            <div className="mt-3 text-xs sm:text-sm text-slate-500">
              Update: <span className="font-medium text-slate-700">{lastUpdated}</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-12">
        {data.length === 0 ? (
          <Card className="p-8 sm:p-12 text-center bg-white/60 backdrop-blur-sm border-slate-200">
            <div className="text-slate-400 mb-4">
              <svg className="mx-auto h-12 w-12 sm:h-16 sm:w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-700 mb-2">Tidak ada data</h3>
            <p className="text-sm sm:text-base text-slate-500">Belum ada data di kolom A spreadsheet Anda</p>
          </Card>
        ) : (
          <>
            <div className="mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-slate-700">
                Data Kolom A <span className="text-emerald-600">({data.length} item)</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {data.map((item, index) => (
                <Card
                  key={item.index}
                  className="group relative overflow-hidden bg-white hover:shadow-xl active:shadow-2xl transition-all duration-300 border-slate-200 hover:border-emerald-300 active:scale-[0.98]"
                  data-testid={`data-card-${index}`}
                >
                  {/* Cell ID Badge */}
                  <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 bg-emerald-100 text-emerald-700 text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                    {item.cell_id}
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 sm:p-6 pt-10 sm:pt-12">
                    {/* Data value - selectable for manual copy */}
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
                    
                    {/* Copy Button */}
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
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-all duration-300 pointer-events-none"></div>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-center text-slate-500 text-xs sm:text-sm">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <p>Auto-sync setiap 15 detik</p>
          </div>
          <span className="hidden sm:inline text-slate-300">•</span>
          <p className="text-slate-400">Long press pada data untuk salin manual</p>
        </div>
      </footer>
    </div>
  );
}

export default App;