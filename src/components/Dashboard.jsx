import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity,
  Users,
  ShoppingCart,
  Target,
  Zap
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useTheme } from './ThemeProvider';
import { financialData, formatCurrency, formatNumber } from '../data/mockData';

const Dashboard = () => {
  const { isDark } = useTheme();

  const StatCard = ({ title, value, change, icon: Icon, color, trend }) => (
    <div className={`card-3d p-6 rounded-xl ${isDark ? 'glass-effect-dark' : 'glass-effect'} hover:scale-105 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${color}`}>
          <Icon className="text-white" size={24} />
        </div>
        <div className={`flex items-center space-x-1 text-sm ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
          {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span>{change}%</span>
        </div>
      </div>
      <div>
        <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-1`}>
          {typeof value === 'number' ? formatCurrency(value) : value}
        </h3>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
      </div>
    </div>
  );

  const ChartCard = ({ title, children, className = "" }) => (
    <div className={`card-3d p-6 rounded-xl ${isDark ? 'glass-effect-dark' : 'glass-effect'} ${className}`}>
      <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-4`}>
        {title}
      </h3>
      <div className="chart-container-3d">
        <div className="chart-3d">
          {children}
        </div>
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 rounded-lg shadow-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {typeof entry.value === 'number' ? formatCurrency(entry.value) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-2`}>
            Financial Dashboard
          </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Welcome back! Here's your business overview.
          </p>
        </div>
        <div className={`px-4 py-2 rounded-lg ${isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'} flex items-center space-x-2`}>
          <Activity size={16} />
          <span className="font-medium">Live</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Income"
          value={financialData.metrics.totalIncome}
          change={12.5}
          trend="up"
          icon={TrendingUp}
          color="from-green-400 to-green-600"
        />
        <StatCard
          title="Total Expenses"
          value={financialData.metrics.totalExpense}
          change={8.2}
          trend="up"
          icon={TrendingDown}
          color="from-red-400 to-red-600"
        />
        <StatCard
          title="Net Profit"
          value={financialData.metrics.netProfit}
          change={15.3}
          trend="up"
          icon={DollarSign}
          color="from-blue-400 to-blue-600"
        />
        <StatCard
          title="Transactions"
          value={formatNumber(financialData.metrics.transactionCount)}
          change={9.7}
          trend="up"
          icon={ShoppingCart}
          color="from-purple-400 to-purple-600"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Monthly Income vs Expenses">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={financialData.monthlyData}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4ade80" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="month" stroke={isDark ? '#9ca3af' : '#6b7280'} />
              <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="income" 
                stroke="#4ade80" 
                fill="url(#incomeGradient)"
                name="Income"
              />
              <Area 
                type="monotone" 
                dataKey="expense" 
                stroke="#ef4444" 
                fill="url(#expenseGradient)"
                name="Expenses"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Traffic & Activity">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={financialData.trafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="time" stroke={isDark ? '#9ca3af' : '#6b7280'} />
              <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="visitors" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                name="Visitors"
              />
              <Line 
                type="monotone" 
                dataKey="transactions" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                name="Transactions"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="Income Categories" className="lg:col-span-1">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={financialData.incomeCategories}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {financialData.incomeCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Weekly Comparison" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={financialData.weeklyComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="day" stroke={isDark ? '#9ca3af' : '#6b7280'} />
              <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="thisWeek" fill="#4ade80" name="This Week" radius={[4, 4, 0, 0]} />
              <Bar dataKey="lastWeek" fill="#94a3b8" name="Last Week" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Recent Transactions */}
      <ChartCard title="Recent Transactions">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className={`text-left py-3 px-4 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Type</th>
                <th className={`text-left py-3 px-4 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Amount</th>
                <th className={`text-left py-3 px-4 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Category</th>
                <th className={`text-left py-3 px-4 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Description</th>
                <th className={`text-left py-3 px-4 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Date</th>
              </tr>
            </thead>
            <tbody>
              {financialData.recentTransactions.slice(0, 5).map((transaction) => (
                <tr key={transaction.id} className={`border-b ${isDark ? 'border-gray-800' : 'border-gray-100'} hover:${isDark ? 'bg-white/5' : 'bg-gray-50'} transition-colors`}>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.type === 'income' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type === 'income' ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
                      {transaction.type}
                    </span>
                  </td>
                  <td className={`py-3 px-4 font-medium ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className={`py-3 px-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {transaction.category}
                  </td>
                  <td className={`py-3 px-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {transaction.description}
                  </td>
                  <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {transaction.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
};

export default Dashboard;