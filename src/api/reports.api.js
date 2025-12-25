import api from './axios';

export const reportsApi = {
  // Payment Reports
  getPaymentsByRange: (params) => api.get('/reports/payments/range', { params }),
  getPaymentsMonthly: (params) => api.get('/reports/payments/monthly', { params }),
  getPaymentsDaily: (params) => api.get('/reports/payments/daily', { params }),
  
  // Financial Reports
  getFinancialSummary: (params) => api.get('/reports/financial/summary', { params }),
  getFinancialSummaryRange: (params) => api.get('/reports/financial/summary-range', { params }),
  
  // Expense Reports
  getExpensesByRange: (params) => api.get('/reports/expenses/range', { params }),
  getExpensesMonthly: (params) => api.get('/reports/expenses/monthly', { params }),
  getExpensesDaily: (params) => api.get('/reports/expenses/daily', { params }),
  getExpensesAllTime: (params) => api.get('/reports/expenses/all-time', { params }),
};

