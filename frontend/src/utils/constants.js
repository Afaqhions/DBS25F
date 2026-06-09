export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Wholesale Management System';
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5127/api';

export const ORDER_STATUS = {
  PENDING: 'Pending',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export const PRODUCT_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  DELETED: 'Deleted',
};

export const TRANSACTION_TYPE = {
  PURCHASE: 'Purchase',
  SALE: 'Sale',
  RETURN: 'Return',
};

export const USER_ROLES = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  STAFF: 'Staff',
  CUSTOMER: 'Customer',
};

export const PAYMENT_METHODS = ['Cash', 'Card', 'Bank'];

export const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

export const STOCK_STATUS = [
  { value: '', label: 'All' },
  { value: 'active', label: 'In Stock' },
  { value: 'low', label: 'Low Stock' },
  { value: 'out', label: 'Out of Stock' },
];

export const REPORT_TYPES = [
  { value: 'sales', label: 'Sales Summary Report', params: ['startDate', 'endDate'] },
  { value: 'top-products', label: 'Top Selling Products', params: ['topN'] },
  { value: 'inventory', label: 'Inventory Status Report', params: [] },
  { value: 'customer-orders', label: 'Customer Orders Summary', params: ['customerId'] },
  { value: 'supplier-performance', label: 'Supplier Performance Report', params: [] },
  { value: 'category-sales', label: 'Category-wise Sales Report', params: ['startDate', 'endDate'] },
  { value: 'monthly-trends', label: 'Monthly Trends Report', params: ['year'] },
  { value: 'low-stock', label: 'Low Stock Alert Report', params: ['threshold'] },
  { value: 'order-fulfillment', label: 'Order Fulfillment Report', params: ['startDate', 'endDate'] },
  { value: 'revenue-by-payment', label: 'Payment Method Analysis Report', params: ['startDate', 'endDate'] },
];

export const ITEMS_PER_PAGE = 10;

export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: 'LayoutDashboard' },
  { label: 'Customers', path: '/customers', icon: 'Users' },
  { label: 'Products', path: '/products', icon: 'Package' },
  { label: 'Orders', path: '/orders', icon: 'ShoppingCart' },
  { label: 'Suppliers', path: '/suppliers', icon: 'Truck' },
  { label: 'Reports', path: '/reports', icon: 'BarChart3' },
  { label: 'Settings', path: '/settings', icon: 'Settings' },
];
