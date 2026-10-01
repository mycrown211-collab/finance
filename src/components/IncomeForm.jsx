import React, { useState, useEffect } from 'react';
import { Plus, Calendar, DollarSign, Tag, FileText, Trash2, Edit2 } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { formatCurrency } from '../data/mockData';
import { db } from '../data/database';

const IncomeForm = () => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].slice(0, 5)
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [incomeList, setIncomeList] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const categories = ['Sales', 'Service', 'Consultation', 'Investment', 'Other'];

  useEffect(() => {
    loadIncomeData();
  }, []);

  const loadIncomeData = () => {
    const data = db.getAllIncome();
    setIncomeList(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      if (editingId) {
        // Update existing income
        db.updateIncome(editingId, formData);
        alert('Income updated successfully!');
        setEditingId(null);
      } else {
        // Add new income
        db.saveIncome(formData);
        alert('Income added successfully!');
      }
      
      // Reset form
      setFormData({
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0].slice(0, 5)
      });
      
      // Reload data
      loadIncomeData();
    } catch (error) {
      alert('Error saving income: ' + error.message);
    }
    
    setIsSubmitting(false);
  };

  const handleEdit = (income) => {
    setFormData({
      amount: income.amount,
      category: income.category,
      description: income.description,
      date: income.date,
      time: income.time
    });
    setEditingId(income.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this income entry? This action cannot be undone.')) {
      try {
        db.deleteIncome(id);
        alert('Income deleted successfully!');
        loadIncomeData();
      } catch (error) {
        alert('Error deleting income: ' + error.message);
      }
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setFormData({ ...formData, amount: value });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].slice(0, 5)
    });
  };

  const getTotalIncome = () => {
    return incomeList.reduce((total, item) => total + parseInt(item.amount), 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-2`}>
            {editingId ? 'Edit Income' : 'Add Income'}
          </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Record your business income and revenue
          </p>
        </div>
        <div className={`px-4 py-2 rounded-lg ${isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'} flex items-center space-x-2`}>
          <DollarSign size={16} />
          <span className="font-medium">Total: {formatCurrency(getTotalIncome())}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className={`lg:col-span-2 space-y-6`}>
          <div className={`card-3d p-6 rounded-xl ${isDark ? 'glass-effect-dark' : 'glass-effect'}`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Amount (IDR)
                  </label>
                  <div className="relative">
                    <DollarSign className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
                    <input
                      type="text"
                      value={formData.amount}
                      onChange={handleAmountChange}
                      placeholder="0"
                      className={`w-full pl-12 pr-4 py-3 rounded-lg form-input-3d ${
                        isDark ? 'text-white placeholder-gray-400' : 'text-gray-800 placeholder-gray-500'
                      } focus:outline-none`}
                      required
                    />
                  </div>
                  {formData.amount && (
                    <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {formatCurrency(parseInt(formData.amount) || 0)}
                    </p>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Category
                  </label>
                  <div className="relative">
                    <Tag className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className={`w-full pl-12 pr-4 py-3 rounded-lg form-input-3d ${
                        isDark ? 'text-white' : 'text-gray-800'
                      } focus:outline-none`}
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Date
                  </label>
                  <div className="relative">
                    <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className={`w-full pl-12 pr-4 py-3 rounded-lg form-input-3d ${
                        isDark ? 'text-white' : 'text-gray-800'
                      } focus:outline-none`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Time
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg form-input-3d ${
                      isDark ? 'text-white' : 'text-gray-800'
                    } focus:outline-none`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Description
                </label>
                <div className="relative">
                  <FileText className={`absolute left-3 top-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter description..."
                    rows={4}
                    className={`w-full pl-12 pr-4 py-3 rounded-lg form-input-3d ${
                      isDark ? 'text-white placeholder-gray-400' : 'text-gray-800 placeholder-gray-500'
                    } focus:outline-none resize-none`}
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-lg btn-3d flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="loading-spinner"></div>
                  ) : (
                    <>
                      <Plus size={20} />
                      <span>{editingId ? 'Update Income' : 'Add Income'}</span>
                    </>
                  )}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-6 py-3 rounded-lg bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Income List */}
          <div className={`card-3d p-6 rounded-xl ${isDark ? 'glass-effect-dark' : 'glass-effect'}`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-4`}>
              Income History ({incomeList.length} entries)
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {incomeList.length === 0 ? (
                <p className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  No income entries yet. Add your first income above.
                </p>
              ) : (
                incomeList.map((income) => (
                  <div
                    key={income.id}
                    className={`p-4 rounded-lg ${isDark ? 'bg-white/5 border border-gray-700' : 'bg-gray-50 border border-gray-200'} hover:${isDark ? 'bg-white/10' : 'bg-gray-100'} transition-colors`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800`}>
                            {income.category}
                          </span>
                          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {income.date} at {income.time}
                          </span>
                        </div>
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'} mb-1`}>
                          {income.description}
                        </p>
                        <p className="text-lg font-bold text-green-500">
                          {formatCurrency(parseInt(income.amount))}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(income)}
                          className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(income.id)}
                          className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <div className={`card-3d p-6 rounded-xl ${isDark ? 'glass-effect-dark' : 'glass-effect'}`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-4`}>
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Entries</span>
                <span className={`font-bold text-blue-500`}>{incomeList.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Income</span>
                <span className={`font-bold text-green-500`}>{formatCurrency(getTotalIncome())}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Average per Entry</span>
                <span className={`font-bold text-purple-500`}>
                  {formatCurrency(incomeList.length > 0 ? getTotalIncome() / incomeList.length : 0)}
                </span>
              </div>
            </div>
          </div>

          <div className={`card-3d p-6 rounded-xl ${isDark ? 'glass-effect-dark' : 'glass-effect'}`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-4`}>
              Top Categories
            </h3>
            <div className="space-y-3">
              {categories.map((cat, index) => {
                const categoryTotal = incomeList
                  .filter(income => income.category === cat)
                  .reduce((sum, income) => sum + parseInt(income.amount), 0);
                const percentage = getTotalIncome() > 0 ? (categoryTotal / getTotalIncome() * 100).toFixed(1) : 0;
                
                return (
                  <div key={cat} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-green-500' : 
                        index === 1 ? 'bg-blue-500' : 
                        index === 2 ? 'bg-purple-500' : 
                        index === 3 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} flex-1`}>{cat}</span>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        {formatCurrency(categoryTotal)}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {percentage}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeForm;