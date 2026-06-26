import client from './client';

export const reportsAPI = {
  generatePDF: (reportType, params) =>
    client.get(`/reports/${reportType}/pdf`, {
      params,
      responseType: 'blob',
    }),

  getSalesSummary: (params) =>
    client.get('/reports/sales-summary', { params }),

  getDashboardStats: () =>
    client.get('/reports/dashboard-stats'),

  getMonthlySales: (params) =>
    client.get('/reports/monthly-sales', { params }),
};
