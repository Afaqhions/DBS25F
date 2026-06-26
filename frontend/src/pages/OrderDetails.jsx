import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ordersAPI } from '../api/orders';
import { formatCurrency, formatDate } from '../utils/formatters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { ArrowLeft, Printer, Package, User, CreditCard, Calendar } from 'lucide-react';

const statusBadgeClass = (status) => {
  const map = {
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800',
    Shipped: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800',
    Delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border border-green-200 dark:border-green-800',
    Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border border-red-200 dark:border-red-800',
    Active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border border-green-200 dark:border-green-800',
    Inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700',
    Deleted: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border border-red-200 dark:border-red-800',
    Paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border border-green-200 dark:border-green-800',
    Unpaid: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800',
  };
  return map[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700';
};

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersAPI.getById(id)
      .then((res) => setOrder(res.data.data || res.data))
      .catch(() => toast.error('Failed to load order details'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner text="Loading order details..." />;
  if (!order) return <p className="text-center text-gray-500 py-12">Order not found</p>;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>Invoice #${order.orderId}</title>
      <style>body{font-family:Arial,sans-serif;padding:40px;}table{width:100%;border-collapse:collapse;}th,td{padding:8px 12px;border:1px solid #ddd;text-align:left;}th{background:#f5f5f5;}.total{font-weight:bold;font-size:18px;}.header{display:flex;justify-content:space-between;margin-bottom:30px;}</style>
      </head><body>
      <div class="header"><h1>INVOICE #${order.orderId}</h1><p>${new Date().toLocaleDateString()}</p></div>
      <p><strong>Customer:</strong> ${order.customerName}</p>
      <p><strong>Order Date:</strong> ${formatDate(order.orderDate)}</p>
      <p><strong>Payment Method:</strong> ${order.paymentMethod || 'N/A'}</p>
      <br/><table><thead><tr><th>#</th><th>Product</th><th>Quantity</th><th>Unit Price</th><th>Subtotal</th></tr></thead><tbody>
      ${(order.items || []).map((item, idx) => `<tr><td>${idx+1}</td><td>${item.productName}</td><td>${item.quantity}</td><td>$${Number(item.unitPrice).toFixed(2)}</td><td>$${Number(item.subtotal).toFixed(2)}</td></tr>`).join('')}
      </tbody></table><br/>
      <p class="total">Total Amount: $${Number(order.totalAmount).toFixed(2)}</p>
      <p><strong>Status:</strong> ${order.status}</p>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/orders" className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 transition">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order #{order.orderId}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Order details and items</p>
          </div>
        </div>
        <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
          <Printer size={16} /> Print Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-900"><User size={20} className="text-blue-600" /></div>
            <div><p className="text-xs text-gray-500">Customer</p><p className="text-sm font-medium">{order.customerName}</p></div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-900"><Calendar size={20} className="text-green-600" /></div>
            <div><p className="text-xs text-gray-500">Order Date</p><p className="text-sm font-medium">{formatDate(order.orderDate)}</p></div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-100 dark:border-yellow-900"><CreditCard size={20} className="text-yellow-600" /></div>
            <div><p className="text-xs text-gray-500">Payment</p><p className="text-sm font-medium">{order.paymentMethod || 'N/A'}</p></div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 border border-purple-100 dark:border-purple-900"><Package size={20} className="text-purple-600" /></div>
            <div><p className="text-xs text-gray-500">Status</p><span className={`inline-flex px-2 py-0.5 text-xs font-medium ${statusBadgeClass(order.status)}`}>{order.status}</span></div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Order Items ({order.items?.length || 0})</h3>
          <p className="text-lg font-bold text-primary">{formatCurrency(order.totalAmount)}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-5 py-3 text-left font-medium text-gray-500">#</th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Product</th>
                <th className="px-5 py-3 text-right font-medium text-gray-500 hidden md:table-cell">Unit Price</th>
                <th className="px-5 py-3 text-center font-medium text-gray-500">Quantity</th>
                <th className="px-5 py-3 text-right font-medium text-gray-500">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {(order.items || []).map((item, idx) => (
                <tr key={item.productId || idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-5 py-3 text-gray-500">{idx + 1}</td>
                  <td className="px-5 py-3 font-medium">{item.productName}</td>
                  <td className="px-5 py-3 text-right hidden md:table-cell">{formatCurrency(item.unitPrice)}</td>
                  <td className="px-5 py-3 text-center">{item.quantity}</td>
                  <td className="px-5 py-3 text-right font-medium">{formatCurrency(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <td colSpan="4" className="px-5 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">Total:</td>
                <td className="px-5 py-3 text-right font-bold text-lg text-primary">{formatCurrency(order.totalAmount)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
