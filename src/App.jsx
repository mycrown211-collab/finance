import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import IncomeForm from './components/IncomeForm';
import ExpenseForm from './components/ExpenseForm';
import InvoiceForm from './components/InvoiceForm';
import Settings from './components/Settings';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    setActiveSection('dashboard');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'income':
        return <IncomeForm />;
      case 'expense':
        return <ExpenseForm />;
      case 'invoice':
        return <InvoiceForm />;
      case 'analytics':
        return <Dashboard />; // Reuse dashboard for analytics
      case 'wallet':
        return <Dashboard />; // Reuse dashboard for wallet view
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  if (isLoading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen flex items-center justify-center">
          <div className="loading-spinner"></div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="flex min-h-screen">
          <Sidebar 
            activeSection={activeSection} 
            setActiveSection={setActiveSection}
            onLogout={handleLogout}
          />
          <main className="flex-1 p-6 overflow-auto">
            {renderContent()}
          </main>
        </div>
      )}
    </ThemeProvider>
  );
}

export default App;