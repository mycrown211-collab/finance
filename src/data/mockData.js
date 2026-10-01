// Enhanced mock data for financial management
export const financialData = {
  // Monthly income/expense data
  monthlyData: [
    { month: 'Jan', income: 15000000, expense: 8000000, profit: 7000000 },
    { month: 'Feb', income: 18000000, expense: 9500000, profit: 8500000 },
    { month: 'Mar', income: 22000000, expense: 11000000, profit: 11000000 },
    { month: 'Apr', income: 19000000, expense: 10200000, profit: 8800000 },
    { month: 'May', income: 25000000, expense: 12500000, profit: 12500000 },
    { month: 'Jun', income: 28000000, expense: 14000000, profit: 14000000 },
  ],

  // Daily transactions
  recentTransactions: [
    { id: 1, type: 'income', amount: 2500000, category: 'Sales', description: 'Product sales', date: '2024-01-15', time: '14:30' },
    { id: 2, type: 'expense', amount: 500000, category: 'Supplies', description: 'Office supplies', date: '2024-01-15', time: '10:15' },
    { id: 3, type: 'income', amount: 1800000, category: 'Service', description: 'Repair service', date: '2024-01-14', time: '16:45' },
    { id: 4, type: 'expense', amount: 300000, category: 'Transport', description: 'Fuel cost', date: '2024-01-14', time: '09:20' },
    { id: 5, type: 'income', amount: 3200000, category: 'Sales', description: 'Bulk order', date: '2024-01-13', time: '11:30' },
    { id: 6, type: 'expense', amount: 750000, category: 'Maintenance', description: 'Equipment maintenance', date: '2024-01-13', time: '08:00' },
  ],

  // Category breakdown
  incomeCategories: [
    { name: 'Sales', value: 45000000, color: '#4ade80' },
    { name: 'Service', value: 25000000, color: '#3b82f6' },
    { name: 'Consultation', value: 15000000, color: '#8b5cf6' },
    { name: 'Other', value: 8000000, color: '#f59e0b' },
  ],

  expenseCategories: [
    { name: 'Supplies', value: 20000000, color: '#ef4444' },
    { name: 'Transport', value: 12000000, color: '#f97316' },
    { name: 'Maintenance', value: 8000000, color: '#eab308' },
    { name: 'Marketing', value: 6000000, color: '#06b6d4' },
    { name: 'Other', value: 4000000, color: '#8b5cf6' },
  ],

  // Performance metrics
  metrics: {
    totalIncome: 93000000,
    totalExpense: 50000000,
    netProfit: 43000000,
    profitMargin: 46.2,
    growthRate: 12.5,
    transactionCount: 156,
  },

  // Traffic/Activity data
  trafficData: [
    { time: '00:00', visitors: 12, transactions: 2 },
    { time: '04:00', visitors: 8, transactions: 1 },
    { time: '08:00', visitors: 45, transactions: 8 },
    { time: '12:00', visitors: 78, transactions: 15 },
    { time: '16:00', visitors: 92, transactions: 18 },
    { time: '20:00', visitors: 65, transactions: 12 },
  ],

  // Weekly comparison
  weeklyComparison: [
    { day: 'Mon', thisWeek: 3500000, lastWeek: 3200000 },
    { day: 'Tue', thisWeek: 4200000, lastWeek: 3800000 },
    { day: 'Wed', thisWeek: 3800000, lastWeek: 4100000 },
    { day: 'Thu', thisWeek: 4500000, lastWeek: 3900000 },
    { day: 'Fri', thisWeek: 5200000, lastWeek: 4800000 },
    { day: 'Sat', thisWeek: 4800000, lastWeek: 4200000 },
    { day: 'Sun', thisWeek: 3200000, lastWeek: 3500000 },
  ],
};

// Utility functions
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat('id-ID').format(num);
};

export const getTransactionsByType = (type) => {
  return financialData.recentTransactions.filter(t => t.type === type);
};

export const getTotalByCategory = (transactions, category) => {
  return transactions
    .filter(t => t.category === category)
    .reduce((sum, t) => sum + t.amount, 0);
};