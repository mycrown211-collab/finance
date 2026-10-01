import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, LogIn } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ id: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isDark } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (credentials.id === 'tomutstore' && credentials.password === 'Mekanik88') {
      onLogin();
    } else {
      setError('Invalid credentials. Please check your ID and password.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className={`w-full max-w-md card-3d ${isDark ? 'glass-effect-dark' : 'glass-effect'} rounded-2xl p-8 neon-glow`}>
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <User size={40} className="text-white" />
          </div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-2`}>
            TomutStore
          </h1>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Financial Management System
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
            <input
              type="text"
              placeholder="Enter your ID"
              value={credentials.id}
              onChange={(e) => setCredentials({ ...credentials, id: e.target.value })}
              className={`w-full pl-12 pr-4 py-3 rounded-lg form-input-3d ${
                isDark ? 'text-white placeholder-gray-400' : 'text-gray-800 placeholder-gray-500'
              } focus:outline-none`}
              required
            />
          </div>

          <div className="relative">
            <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className={`w-full pl-12 pr-12 py-3 rounded-lg form-input-3d ${
                isDark ? 'text-white placeholder-gray-400' : 'text-gray-800 placeholder-gray-500'
              } focus:outline-none`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'} hover:text-blue-500 transition-colors`}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg btn-3d flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="loading-spinner"></div>
            ) : (
              <>
                <LogIn size={20} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className={`mt-6 text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          <p>Demo Credentials:</p>
          <p>ID: tomutstore | Password: Mekanik88</p>
        </div>
      </div>
    </div>
  );
};

export default Login;