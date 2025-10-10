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
          <div className="flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Google Sheets Sync
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Data realtime dari spreadsheet Anda</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <Navigation />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-12">
        <Routes>
          <Route path="/" element={<DataKolomA />} />
          <Route path="/template-chat" element={<TemplateChat />} />
        </Routes>
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

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;