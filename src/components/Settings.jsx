import React, { useState } from 'react';
import { 
  Moon, 
  Sun, 
  Palette, 
  Bell, 
  Shield, 
  Database,
  Download,
  Upload,
  Trash2,
  Save
} from 'lucide-react';
import { useTheme } from './ThemeProvider';

const Settings = () => {
  const { isDark, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    notifications: true,
    autoBackup: true,
    currency: 'IDR',
    language: 'en',
    dateFormat: 'DD/MM/YYYY'
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

  const handleExportData = () => {
    const data = {
      settings,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tomutstore-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const SettingCard = ({ title, description, children }) => (
    <div className={`card-3d p-6 rounded-xl ${isDark ? 'glass-effect-dark' : 'glass-effect'}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-2`}>
            {title}
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
            {description}
          </p>
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-2`}>
            Settings
          </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Customize your application preferences
          </p>
        </div>
        <button
          onClick={handleSave}
          className="btn-3d px-6 py-3 rounded-lg flex items-center space-x-2"
        >
          <Save size={20} />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance Settings */}
        <SettingCard
          title="Appearance"
          description="Customize the look and feel of your application"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {isDark ? <Moon size={20} /> : <Sun size={20} />}
                <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Dark Mode
                </span>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isDark ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDark ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Palette size={20} />
                <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Theme Color
                </span>
              </div>
              <div className="flex space-x-2">
                {['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-red-500'].map((color, index) => (
                  <button
                    key={index}
                    className={`w-6 h-6 rounded-full ${color} ${index === 0 ? 'ring-2 ring-white' : ''}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </SettingCard>

        {/* Notification Settings */}
        <SettingCard
          title="Notifications"
          description="Manage your notification preferences"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell size={20} />
                <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Push Notifications
                </span>
              </div>
              <button
                onClick={() => handleSettingChange('notifications', !settings.notifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.notifications ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Database size={20} />
                <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Auto Backup
                </span>
              </div>
              <button
                onClick={() => handleSettingChange('autoBackup', !settings.autoBackup)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.autoBackup ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.autoBackup ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </SettingCard>

        {/* Regional Settings */}
        <SettingCard
          title="Regional Settings"
          description="Configure currency, language, and date formats"
        >
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Currency
              </label>
              <select
                value={settings.currency}
                onChange={(e) => handleSettingChange('currency', e.target.value)}
                className={`w-full px-4 py-2 rounded-lg form-input-3d ${
                  isDark ? 'text-white' : 'text-gray-800'
                } focus:outline-none`}
              >
                <option value="IDR">Indonesian Rupiah (IDR)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Date Format
              </label>
              <select
                value={settings.dateFormat}
                onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                className={`w-full px-4 py-2 rounded-lg form-input-3d ${
                  isDark ? 'text-white' : 'text-gray-800'
                } focus:outline-none`}
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </SettingCard>

        {/* Data Management */}
        <SettingCard
          title="Data Management"
          description="Export, import, or clear your application data"
        >
          <div className="space-y-4">
            <button
              onClick={handleExportData}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
            >
              <Download size={16} />
              <span>Export Data</span>
            </button>

            <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors">
              <Upload size={16} />
              <span>Import Data</span>
            </button>

            <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
              <Trash2 size={16} />
              <span>Clear All Data</span>
            </button>
          </div>
        </SettingCard>

        {/* Security */}
        <SettingCard
          title="Security"
          description="Manage your account security settings"
        >
          <div className="space-y-4">
            <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors">
              <Shield size={16} />
              <span>Change Password</span>
            </button>

            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
              <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'} mb-2`}>
                Current User
              </h4>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                ID: tomutstore
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Role: Administrator
              </p>
            </div>
          </div>
        </SettingCard>

        {/* About */}
        <SettingCard
          title="About"
          description="Application information and version details"
        >
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Version</span>
              <span className={`${isDark ? 'text-white' : 'text-gray-800'}`}>1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Last Updated</span>
              <span className={`${isDark ? 'text-white' : 'text-gray-800'}`}>2024-01-15</span>
            </div>
            <div className="flex justify-between">
              <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Developer</span>
              <span className={`${isDark ? 'text-white' : 'text-gray-800'}`}>TomutStore Team</span>
            </div>
          </div>
        </SettingCard>
      </div>
    </div>
  );
};

export default Settings;