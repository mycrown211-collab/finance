import React, { useState, useEffect } from 'react';
import { Minus, Calendar, DollarSign, Tag, FileText, Trash2, Edit2 } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { formatCurrency } from '../data/mockData';
import { db } from '../data/database';

const ExpenseForm = () => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].slice(0, 5)
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expenseList, setExpenseList] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const categories = ['Supplies', 'Transport', 'Maintenance', 'Marketing', 'Utilities', 'Other'];

  useEffect(() => {
    loadExpenseData();
  }, []);

  const loadExpenseData = () => {
    const data = db.getAllExpenses();
    setExpenseList(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      if (editingId) {
        // Update existing expense
        db.updateExpense(editingId, formData);
        alert('Expense updated successfully!');
        setEditingId(null);
      } else {
        // Add new expense
        db.saveExpense(formData);
        alert('Expense added successfully!');
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
      loadExpenseData();
    } catch (error) {
      alert('Error saving expense: ' + error.message);
    }
    
    setIsSubmitting(false);
  };

  const handleEdit = (expense) => {
    setFormData({
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date,
      time: expense.time
    });
    setEditingId(expense.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense entry? This action cannot be undone.')) {
      try {
        db.deleteExpense(id);
        alert('Expense deleted successfully!');
        loadExpenseData();
      } catch (error) {
        alert('Error deleting expense: ' + error.message);
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

  const getTotalExpenses = () => {
    return expenseList.reduce((total, item) => total + parseInt(item.amount), 0);
  };

  const getBudgetUsage = () => {
    const monthlyBudget = 15000000; // 15 million IDR budget
    const totalExpenses = getTotalExpenses();
    return Math.min((totalExpenses / monthlyBudget) * 100, 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-2`}>
            {editingId ? 'Edit Expense' : 'Add Expense'}
          </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Track your business expenses and costs
          </p>
        </div>
        <div className={`px-4 py-2 rounded-lg ${isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'} flex items-center space-x-2`}>
          <Minus size={16} />
          <span className="font-medium">Total: {formatCurrency(getTotalExpenses())}</span>
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
                  className="flex-1 py-3 rounded-lg btn-3d flex items-center justify-center space-x-2 disabled:opacity-50 bg-gradient-to-r from-red-400 to-red-600"
                >
                  {isSubmitting ? (
                    <div className="loading-spinner"></div>
                  ) : (
                    <>
                      <Minus size={20} />
                      <span>{editingId ? 'Update Expense' : 'Add Expense'}</span>
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

          {/* Expense List */}
          <div className={`card-3d p-6 rounded-xl ${isDark ? 'glass-effect-dark' : 'glass-effect'}`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-4`}>
              Expense History ({expenseList.length} entries)
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {expenseList.length === 0 ? (
                <p className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  No expense entries yet. Add your first expense above.
                </p>
              ) : (
                expenseList.map((expense) => (
                  <div
                    key={expense.id}
                    className={`p-4 rounded-lg ${isDark ? 'bg-white/5 border border-gray-700' : 'bg-gray-50 border border-gray-200'} hover:${isDark ? 'bg-white/10' : 'bg-gray-100'} transition-colors`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800`}>
                            {expense.category}
                          </span>
                          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {expense.date} at {expense.time}
                          </span>
                        </div>
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'} mb-1`}>
                          {expense.description}
                        </p>
                        <p className="text-lg font-bold text-red-500">
                          {formatCurrency(parseInt(expense.amount))}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(expense)}
                          className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id)}
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
              Expense Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Entries</span>
                <span className={`font-bold text-blue-500`}>{expenseList.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Expenses</span>
                <span className={`font-bold text-red-500`}>{formatCurrency(getTotalExpenses())}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Average per Entry</span>
                <span className={`font-bold text-purple-500`}>
                  {formatCurrency(expenseList.length > 0 ? getTotalExpenses() / expenseList.length : 0)}
                </span>
              </div>
            </div>
          </div>

          <div className={`card-3d p-6 rounded-xl ${isDark ? 'glass-effect-dark' : 'glass-effect'}`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-4`}>
              Budget Alert
            </h3>
            <div className="space-y-3">
              <div className={`p-3 rounded-lg ${
                getBudgetUsage() > 80 
                  ? isDark ? 'bg-red-500/20 border border-red-500/50' : 'bg-red-100 border border-red-300'
                  : getBudgetUsage() > 60
                  ? isDark ? 'bg-yellow-500/20 border border-yellow-500/50' : 'bg-yellow-100 border border-yellow-300'
                  : isDark ? 'bg-green-500/20 border border-green-500/50' : 'bg-green-100 border border-green-300'
              }`}>
                <p className={`text-sm ${
                  getBudgetUsage() > 80 
                    ? isDark ? 'text-red-400' : 'text-red-800'
                    : getBudgetUsage() > 60
                    ? isDark ? 'text-yellow-400' : 'text-yellow-800'
                    : isDark ? 'text-green-400' : 'text-green-800'
                }`}>
                  You've used {getBudgetUsage().toFixed(1)}% of your monthly budget
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    getBudgetUsage() > 80 ? 'bg-red-500' : getBudgetUsage() > 60 ? 'bg-yellow-500' : 'bg-green-500'
                  }`} 
                  style={{ width: `${getBudgetUsage()}%` }}
                ></div>
              </div>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Monthly Budget: {formatCurrency(15000000)}
              </p>
            </div>
          </div>

          <div className={`card-3d p-6 rounded-xl ${isDark ? 'glass-effect-dark' : 'glass-effect'}`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-4`}>
              Top Categories
            </h3>
            <div className="space-y-3">
              {categories.map((cat, index) => {
                const categoryTotal = expenseList
                  .filter(expense => expense.category === cat)
                  .reduce((sum, expense) => sum + parseInt(expense.amount), 0);
                const percentage = getTotalExpenses() > 0 ? (categoryTotal / getTotalExpenses() * 100).toFixed(1) : 0;
                
                return (
                  <div key={cat} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-red-500' : 
                        index === 1 ? 'bg-orange-500' : 
                        index === 2 ? 'bg-yellow-500' : 
                        index === 3 ? 'bg-cyan-500' : 
                        index === 4 ? 'bg-purple-500' : 'bg-gray-500'
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

export default ExpenseForm;