import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  TrendingDown, 
  Settings, 
  LogOut,
  DollarSign,
  BarChart3,
  Wallet,
  FileText
} from 'lucide-react';
import { useTheme } from './ThemeProvider';

const Sidebar = ({ activeSection, setActiveSection, onLogout }) => {
  const { isDark } = useTheme();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-blue-500' },
    { id: 'income', label: 'Income', icon: TrendingUp, color: 'text-green-500' },
    { id: 'expense', label: 'Expenses', icon: TrendingDown, color: 'text-red-500' },
    { id: 'invoice', label: 'Invoice', icon: FileText, color: 'text-purple-500' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'text-indigo-500' },
    { id: 'wallet', label: 'Wallet', icon: Wallet, color: 'text-yellow-500' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-gray-500' },
  ];

  return (
    <div className={`w-64 h-screen sidebar-3d ${isDark ? 'glass-effect-dark' : 'glass-effect'} p-6 flex flex-col`}>
      {/* Logo Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <DollarSign className="text-white" size={24} />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              TomutStore
            </h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Financial Manager
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                isActive
                  ? `${isDark ? 'bg-white/20' : 'bg-white/30'} ${item.color} shadow-lg`
                  : `${isDark ? 'text-gray-300 hover:bg-white/10' : 'text-gray-700 hover:bg-white/20'} hover:${item.color}`
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 rounded-full bg-current animate-pulse"></div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
          isDark ? 'text-red-400 hover:bg-red-500/20' : 'text-red-500 hover:bg-red-50'
        }`}
      >
        <LogOut size={20} />
        <span className="font-medium">Logout</span>
      </button>

      {/* User Info */}
      <div className={`mt-4 p-4 rounded-lg ${isDark ? 'bg-white/10' : 'bg-white/20'}`}>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
            <span className="text-white text-sm font-bold">T</span>
          </div>
          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
              TomutStore
            </p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Admin
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;