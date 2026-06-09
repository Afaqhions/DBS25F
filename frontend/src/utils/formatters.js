import { format, formatDistanceToNow, parseISO } from 'date-fns';

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount || 0);
}

export function formatDate(dateStr) {
  if (!dateStr) return '-';
  try {
    return format(parseISO(dateStr), 'MMM dd, yyyy');
  } catch {
    return dateStr;
  }
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '-';
  try {
    return format(parseISO(dateStr), 'MMM dd, yyyy h:mm a');
  } catch {
    return dateStr;
  }
}

export function formatRelativeTime(dateStr) {
  if (!dateStr) return '-';
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
  } catch {
    return dateStr;
  }
}

export function getStatusBadgeClass(status) {
  const map = {
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Shipped: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    Delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    Active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    Deleted: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    Paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Unpaid: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  };
  return map[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
}

export function formatStockLevel(quantity, threshold = 10) {
  if (quantity <= 0) return { label: 'Out of Stock', class: 'text-red-600 font-semibold' };
  if (quantity <= threshold) return { label: `Low (${quantity})`, class: 'text-yellow-600 font-semibold' };
  return { label: `${quantity}`, class: 'text-green-600' };
}
