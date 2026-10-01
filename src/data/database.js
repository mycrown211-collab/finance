// Simple database system using localStorage for data persistence
export class FinancialDatabase {
  constructor() {
    this.INCOME_KEY = 'tomutstore_income_data';
    this.EXPENSE_KEY = 'tomutstore_expense_data';
    this.INVOICE_KEY = 'tomutstore_invoice_data';
  }

  // Income operations
  saveIncome(incomeData) {
    const existingIncome = this.getAllIncome();
    const newIncome = {
      id: Date.now().toString(),
      ...incomeData,
      createdAt: new Date().toISOString()
    };
    const updatedIncome = [...existingIncome, newIncome];
    localStorage.setItem(this.INCOME_KEY, JSON.stringify(updatedIncome));
    return newIncome;
  }

  getAllIncome() {
    const data = localStorage.getItem(this.INCOME_KEY);
    return data ? JSON.parse(data) : [];
  }

  deleteIncome(id) {
    const existingIncome = this.getAllIncome();
    const filteredIncome = existingIncome.filter(item => item.id !== id);
    localStorage.setItem(this.INCOME_KEY, JSON.stringify(filteredIncome));
    return true;
  }

  updateIncome(id, updatedData) {
    const existingIncome = this.getAllIncome();
    const updatedIncome = existingIncome.map(item => 
      item.id === id ? { ...item, ...updatedData, updatedAt: new Date().toISOString() } : item
    );
    localStorage.setItem(this.INCOME_KEY, JSON.stringify(updatedIncome));
    return updatedIncome.find(item => item.id === id);
  }

  // Expense operations
  saveExpense(expenseData) {
    const existingExpenses = this.getAllExpenses();
    const newExpense = {
      id: Date.now().toString(),
      ...expenseData,
      createdAt: new Date().toISOString()
    };
    const updatedExpenses = [...existingExpenses, newExpense];
    localStorage.setItem(this.EXPENSE_KEY, JSON.stringify(updatedExpenses));
    return newExpense;
  }

  getAllExpenses() {
    const data = localStorage.getItem(this.EXPENSE_KEY);
    return data ? JSON.parse(data) : [];
  }

  deleteExpense(id) {
    const existingExpenses = this.getAllExpenses();
    const filteredExpenses = existingExpenses.filter(item => item.id !== id);
    localStorage.setItem(this.EXPENSE_KEY, JSON.stringify(filteredExpenses));
    return true;
  }

  updateExpense(id, updatedData) {
    const existingExpenses = this.getAllExpenses();
    const updatedExpenses = existingExpenses.map(item => 
      item.id === id ? { ...item, ...updatedData, updatedAt: new Date().toISOString() } : item
    );
    localStorage.setItem(this.EXPENSE_KEY, JSON.stringify(updatedExpenses));
    return updatedExpenses.find(item => item.id === id);
  }

  // Invoice operations
  saveInvoice(invoiceData) {
    const existingInvoices = this.getAllInvoices();
    const newInvoice = {
      id: Date.now().toString(),
      ...invoiceData,
      createdAt: new Date().toISOString()
    };
    const updatedInvoices = [...existingInvoices, newInvoice];
    localStorage.setItem(this.INVOICE_KEY, JSON.stringify(updatedInvoices));
    return newInvoice;
  }

  getAllInvoices() {
    const data = localStorage.getItem(this.INVOICE_KEY);
    return data ? JSON.parse(data) : [];
  }

  deleteInvoice(id) {
    const existingInvoices = this.getAllInvoices();
    const filteredInvoices = existingInvoices.filter(item => item.id !== id);
    localStorage.setItem(this.INVOICE_KEY, JSON.stringify(filteredInvoices));
    return true;
  }

  // Utility functions
  getTotalIncome() {
    const income = this.getAllIncome();
    return income.reduce((total, item) => total + parseInt(item.amount), 0);
  }

  getTotalExpenses() {
    const expenses = this.getAllExpenses();
    return expenses.reduce((total, item) => total + parseInt(item.amount), 0);
  }

  getNetProfit() {
    return this.getTotalIncome() - this.getTotalExpenses();
  }

  // Clear all data (for testing or reset purposes)
  clearAllData() {
    localStorage.removeItem(this.INCOME_KEY);
    localStorage.removeItem(this.EXPENSE_KEY);
    localStorage.removeItem(this.INVOICE_KEY);
  }

  // Export data for backup
  exportData() {
    return {
      income: this.getAllIncome(),
      expenses: this.getAllExpenses(),
      invoices: this.getAllInvoices(),
      exportDate: new Date().toISOString()
    };
  }

  // Import data from backup
  importData(data) {
    if (data.income) {
      localStorage.setItem(this.INCOME_KEY, JSON.stringify(data.income));
    }
    if (data.expenses) {
      localStorage.setItem(this.EXPENSE_KEY, JSON.stringify(data.expenses));
    }
    if (data.invoices) {
      localStorage.setItem(this.INVOICE_KEY, JSON.stringify(data.invoices));
    }
  }
}

// Create a singleton instance
export const db = new FinancialDatabase();