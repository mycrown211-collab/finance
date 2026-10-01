import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Plus, 
  Minus, 
  Calendar, 
  User, 
  Mail, 
  Phone,
  MapPin,
  Hash
} from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { formatCurrency } from '../data/mockData';

const InvoiceForm = () => {
  const { isDark } = useTheme();
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    customer: {
      name: '',
      email: '',
      phone: '',
      address: ''
    },
    items: [
      { description: '', quantity: 1, price: 0, total: 0 }
    ],
    notes: '',
    tax: 11, // PPN 11%
    discount: 0
  });

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { description: '', quantity: 1, price: 0, total: 0 }]
    });
  };

  const removeItem = (index) => {
    const newItems = invoiceData.items.filter((_, i) => i !== index);
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...invoiceData.items];
    newItems[index][field] = value;
    
    if (field === 'quantity' || field === 'price') {
      newItems[index].total = newItems[index].quantity * newItems[index].price;
    }
    
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  const calculateSubtotal = () => {
    return invoiceData.items.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return (subtotal * invoiceData.tax) / 100;
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    return (subtotal * invoiceData.discount) / 100;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    const discount = calculateDiscount();
    return subtotal + tax - discount;
  };

  const generatePDF = () => {
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Invoice ${invoiceData.invoiceNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 2px solid #667eea; padding-bottom: 20px; }
          .company { color: #667eea; }
          .company h1 { margin: 0; font-size: 28px; }
          .company p { margin: 5px 0; color: #666; }
          .invoice-info { text-align: right; }
          .invoice-info h2 { margin: 0; color: #667eea; font-size: 24px; }
          .invoice-info p { margin: 5px 0; }
          .customer-info { background: #f8f9ff; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
          .customer-info h3 { margin-top: 0; color: #667eea; }
          .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .items-table th, .items-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          .items-table th { background: #667eea; color: white; }
          .items-table .number { text-align: center; }
          .items-table .price { text-align: right; }
          .totals { margin-left: auto; width: 300px; }
          .totals table { width: 100%; }
          .totals td { padding: 8px; border-bottom: 1px solid #eee; }
          .totals .total-row { font-weight: bold; font-size: 18px; background: #667eea; color: white; }
          .notes { margin-top: 30px; padding: 20px; background: #f8f9ff; border-radius: 8px; }
          .footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company">
            <h1>TomutStore</h1>
            <p>Financial Management System</p>
            <p>Email: admin@tomutstore.com</p>
            <p>Phone: +62 123 456 789</p>
          </div>
          <div class="invoice-info">
            <h2>INVOICE</h2>
            <p><strong>Invoice #:</strong> ${invoiceData.invoiceNumber}</p>
            <p><strong>Date:</strong> ${new Date(invoiceData.date).toLocaleDateString('id-ID')}</p>
            <p><strong>Due Date:</strong> ${new Date(invoiceData.dueDate).toLocaleDateString('id-ID')}</p>
          </div>
        </div>

        <div class="customer-info">
          <h3>Bill To:</h3>
          <p><strong>${invoiceData.customer.name}</strong></p>
          <p>${invoiceData.customer.email}</p>
          <p>${invoiceData.customer.phone}</p>
          <p>${invoiceData.customer.address}</p>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Description</th>
              <th class="number">Qty</th>
              <th class="price">Price</th>
              <th class="price">Total</th>
            </tr>
          </thead>
          <tbody>
            ${invoiceData.items.map((item, index) => `
              <tr>
                <td class="number">${index + 1}</td>
                <td>${item.description}</td>
                <td class="number">${item.quantity}</td>
                <td class="price">${formatCurrency(item.price)}</td>
                <td class="price">${formatCurrency(item.total)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <table>
            <tr>
              <td>Subtotal:</td>
              <td class="price">${formatCurrency(calculateSubtotal())}</td>
            </tr>
            ${invoiceData.discount > 0 ? `
            <tr>
              <td>Discount (${invoiceData.discount}%):</td>
              <td class="price">-${formatCurrency(calculateDiscount())}</td>
            </tr>
            ` : ''}
            <tr>
              <td>Tax (${invoiceData.tax}%):</td>
              <td class="price">${formatCurrency(calculateTax())}</td>
            </tr>
            <tr class="total-row">
              <td>Total:</td>
              <td class="price">${formatCurrency(calculateTotal())}</td>
            </tr>
          </table>
        </div>

        ${invoiceData.notes ? `
        <div class="notes">
          <h3>Notes:</h3>
          <p>${invoiceData.notes}</p>
        </div>
        ` : ''}

        <div class="footer">
          <p>Thank you for your business!</p>
          <p>Generated on ${new Date().toLocaleDateString('id-ID')} by TomutStore Financial Management System</p>
        </div>
      </body>
      </html>
    `;

    // Create a new window and print
    const printWindow = window.open('', '_blank');
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    
    // Wait for content to load then trigger print/save as PDF
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-2`}>
            Create Invoice
          </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Generate professional invoices for your customers
          </p>
        </div>
        <button
          onClick={generatePDF}
          className="btn-3d px-6 py-3 rounded-lg flex items-center space-x-2 bg-gradient-to-r from-purple-400 to-purple-600"
        >
          <Download size={20} />
          <span>Download PDF</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Form */}
        <div className={`lg:col-span-2 space-y-6`}>
          {/* Invoice Details */}
          <div className={`card-3d p-6 rounded-xl ${isDark ? 'glass-effect-dark' : 'glass-effect'}`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-4`}>
              Invoice Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Invoice Number
                </label>
                <div className="relative">
                  <Hash className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
                  <input
                    type="text"
                    value={invoiceData.invoiceNumber}
                    onChange={(e) => setInvoiceData({...invoiceData, invoiceNumber: e.target.value})}
                    className={`w-full pl-12 pr-4 py-3 rounded-lg form-input-3d ${
                      isDark ? 'text-white' : 'text-gray-800'
                    } focus:outline-none`}
                  />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Invoice Date
                </label>
                <div className="relative">
                  <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
                  <input
                    type="date"
                    value={invoiceData.date}
                    onChange={(e) => setInvoiceData({...invoiceData, date: e.target.value})}
                    className={`w-full pl-12 pr-4 py-3 rounded-lg form-input-3d ${
                      isDark ? 'text-white' : 'text-gray-800'
                    } focus:outline-none`}
                  />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Due Date
                </label>
                <div className="relative">
                  <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
                  <input
                    type="date"
                    value={invoiceData.dueDate}
                    onChange={(e) => setInvoiceData({...invoiceData, dueDate: e.target.value})}
                    className={`w-full pl-12 pr-4 py-3 rounded-lg form-input-3d ${
                      isDark ? 'text-white' : 'text-gray-800'
                    } focus:outline-none`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className={`card-3d p-6 rounded-xl ${isDark ? 'glass-effect-dark' : 'glass-effect'}`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-4`}>
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Customer Name
                </label>
                <div className="relative">
                  <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
                  <input
                    type="text"
                    value={invoiceData.customer.name}
                    onChange={(e) => setInvoiceData({
                      ...invoiceData, 
                      customer: {...invoiceData.customer, name: e.target.value}
                    })}
                    placeholder="Enter customer name"
                    className={`w-full pl-12 pr-4 py-3 rounded-lg form-input-3d ${
                      isDark ? 'text-white placeholder-gray-400' : 'text-gray-800 placeholder-gray-500'
                    } focus:outline-none`}
                  />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Email
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
                  <input
                    type="email"
                    value={invoiceData.customer.email}
                    onChange={(e) => setInvoiceData({
                      ...invoiceData, 
                      customer: {...invoiceData.customer, email: e.target.value}
                    })}
                    placeholder="customer@email.com"
                    className={`w-full pl-12 pr-4 py-3 rounded-lg form-input-3d ${
                      isDark ? 'text-white placeholder-gray-400' : 'text-gray-800 placeholder-gray-500'
                    } focus:outline-none`}
                  />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Phone
                </label>
                <div className="relative">
                  <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
                  <input
                    type="tel"
                    value={invoiceData.customer.phone}
                    onChange={(e) => setInvoiceData({
                      ...invoiceData, 
                      customer: {...invoiceData.customer, phone: e.target.value}
                    })}
                    placeholder="+62 123 456 789"
                    className={`w-full pl-12 pr-4 py-3 rounded-lg form-input-3d ${
                      isDark ? 'text-white placeholder-gray-400' : 'text-gray-800 placeholder-gray-500'
                    } focus:outline-none`}
                  />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Address
                </label>
                <div className="relative">
                  <MapPin className={`absolute left-3 top-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
                  <textarea
                    value={invoiceData.customer.address}
                    onChange={(e) => setInvoiceData({
                      ...invoiceData, 
                      customer: {...invoiceData.customer, address: e.target.value}
                    })}
                    placeholder="Customer address"
                    rows={3}
                    className={`w-full pl-12 pr-4 py-3 rounded-lg form-input-3d ${
                      isDark ? 'text-white placeholder-gray-400' : 'text-gray-800 placeholder-gray-500'
                    } focus:outline-none resize-none`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className={`card-3d p-6 rounded-xl ${isDark ? 'glass-effect-dark' : 'glass-effect'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Invoice Items
              </h3>
              <button
                onClick={addItem}
                className="btn-3d px-4 py-2 rounded-lg flex items-center space-x-2 bg-gradient-to-r from-green-400 to-green-600"
              >
                <Plus size={16} />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-4">
              {invoiceData.items.map((item, index) => (
                <div key={index} className={`p-4 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-5">
                      <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Description
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        placeholder="Item description"
                        className={`w-full px-4 py-2 rounded-lg form-input-3d ${
                          isDark ? 'text-white placeholder-gray-400' : 'text-gray-800 placeholder-gray-500'
                        } focus:outline-none`}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Quantity
                      </label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                        min="1"
                        className={`w-full px-4 py-2 rounded-lg form-input-3d ${
                          isDark ? 'text-white' : 'text-gray-800'
                        } focus:outline-none`}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Price
                      </label>
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => updateItem(index, 'price', parseInt(e.target.value) || 0)}
                        min="0"
                        className={`w-full px-4 py-2 rounded-lg form-input-3d ${
                          isDark ? 'text-white' : 'text-gray-800'
                        } focus:outline-none`}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Total
                      </label>
                      <div className={`px-4 py-2 rounded-lg ${isDark ? 'bg-gray-700 text-green-400' : 'bg-gray-100 text-green-600'} font-medium`}>
                        {formatCurrency(item.total)}
                      </div>
                    </div>
                    <div className="md:col-span-1">
                      {invoiceData.items.length > 1 && (
                        <button
                          onClick={() => removeItem(index)}
                          className="w-full p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Settings */}
          <div className={`card-3d p-6 rounded-xl ${isDark ? 'glass-effect-dark' : 'glass-effect'}`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-4`}>
              Additional Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Tax (%)
                </label>
                <input
                  type="number"
                  value={invoiceData.tax}
                  onChange={(e) => setInvoiceData({...invoiceData, tax: parseFloat(e.target.value) || 0})}
                  min="0"
                  max="100"
                  step="0.1"
                  className={`w-full px-4 py-2 rounded-lg form-input-3d ${
                    isDark ? 'text-white' : 'text-gray-800'
                  } focus:outline-none`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Discount (%)
                </label>
                <input
                  type="number"
                  value={invoiceData.discount}
                  onChange={(e) => setInvoiceData({...invoiceData, discount: parseFloat(e.target.value) || 0})}
                  min="0"
                  max="100"
                  step="0.1"
                  className={`w-full px-4 py-2 rounded-lg form-input-3d ${
                    isDark ? 'text-white' : 'text-gray-800'
                  } focus:outline-none`}
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Notes
              </label>
              <textarea
                value={invoiceData.notes}
                onChange={(e) => setInvoiceData({...invoiceData, notes: e.target.value})}
                placeholder="Additional notes or terms..."
                rows={3}
                className={`w-full px-4 py-3 rounded-lg form-input-3d ${
                  isDark ? 'text-white placeholder-gray-400' : 'text-gray-800 placeholder-gray-500'
                } focus:outline-none resize-none`}
              />
            </div>
          </div>
        </div>

        {/* Invoice Preview */}
        <div className="space-y-6">
          <div className={`card-3d p-6 rounded-xl ${isDark ? 'glass-effect-dark' : 'glass-effect'}`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-4`}>
              Invoice Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Subtotal:</span>
                <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {formatCurrency(calculateSubtotal())}
                </span>
              </div>
              {invoiceData.discount > 0 && (
                <div className="flex justify-between">
                  <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Discount ({invoiceData.discount}%):
                  </span>
                  <span className="font-medium text-red-500">
                    -{formatCurrency(calculateDiscount())}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Tax ({invoiceData.tax}%):
                </span>
                <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {formatCurrency(calculateTax())}
                </span>
              </div>
              <div className={`flex justify-between pt-3 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  Total:
                </span>
                <span className="text-lg font-bold text-blue-500">
                  {formatCurrency(calculateTotal())}
                </span>
              </div>
            </div>
          </div>

          <div className={`card-3d p-6 rounded-xl ${isDark ? 'glass-effect-dark' : 'glass-effect'}`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-4`}>
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={generatePDF}
                className="w-full btn-3d py-3 rounded-lg flex items-center justify-center space-x-2"
              >
                <FileText size={16} />
                <span>Preview Invoice</span>
              </button>
              <button
                onClick={() => {
                  const newInvoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
                  setInvoiceData({
                    ...invoiceData,
                    invoiceNumber: newInvoiceNumber,
                    customer: { name: '', email: '', phone: '', address: '' },
                    items: [{ description: '', quantity: 1, price: 0, total: 0 }],
                    notes: ''
                  });
                }}
                className="w-full py-3 rounded-lg bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 transition-colors flex items-center justify-center space-x-2"
              >
                <Plus size={16} />
                <span>New Invoice</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;