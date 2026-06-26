import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import OrderTable from '../components/tables/OrderTable';
import Pagination from '../components/common/Pagination';
import ConfirmDialog from '../components/common/ConfirmDialog';
import DateRangePicker from '../components/common/DateRangePicker';
import { ordersAPI } from '../api/orders';
import { usePagination } from '../hooks/usePagination';
import { ORDER_STATUS } from '../utils/constants';
import toast from 'react-hot-toast';
import { Plus, RefreshCw, Printer } from 'lucide-react';
import { saveAs } from 'file-saver';

export default function Orders() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [customerFilter] = useState(searchParams.get('customerId') || '');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [sortColumn, setSortColumn] = useState('orderDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [cancelTarget, setCancelTarget] = useState(null);

  const pagination = usePagination({ totalCount, pageSize: 10 });

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.currentPage,
        pageSize: 10,
        sortColumn,
        sortDirection,
      };
      if (statusFilter) params.status = statusFilter;
      if (customerFilter) params.customerId = customerFilter;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const res = await ordersAPI.getAll(params);
      const data = res.data.data || res.data;
      setOrders(data.items || []);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      toast.error('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, statusFilter, customerFilter, startDate, endDate, sortColumn, sortDirection]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection((d) => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const handleUpdateStatus = async (order, newStatus) => {
    try {
      await ordersAPI.updateStatus(order.orderId, newStatus);
      toast.success(`Order #${order.orderId} marked as ${newStatus}`);
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleCancel = async () => {
    if (!cancelTarget) return;
    try {
      await ordersAPI.cancel(cancelTarget.orderId);
      toast.success('Order cancelled successfully');
      setCancelTarget(null);
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order');
    }
  };

  const handlePrintInvoice = (order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>Invoice #${order.orderId}</title>
      <style>body{font-family:Arial,sans-serif;padding:40px;}table{width:100%;border-collapse:collapse;}th,td{padding:8px 12px;border:1px solid #ddd;text-align:left;}.total{font-weight:bold;font-size:18px;}</style>
      </head><body>
      <h1>INVOICE #${order.orderId}</h1>
      <p><strong>Customer:</strong> ${order.customerName}</p>
      <p><strong>Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}</p>
      <p><strong>Payment:</strong> ${order.paymentMethod}</p>
      <br/><table><thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr></thead><tbody>
      ${(order.items || []).map(item => `<tr><td>${item.productName}</td><td>${item.quantity}</td><td>$${Number(item.unitPrice).toFixed(2)}</td><td>$${Number(item.subtotal).toFixed(2)}</td></tr>`).join('')}
      </tbody></table><br/>
      <p class="total">Total: $${Number(order.totalAmount).toFixed(2)}</p>
      <p><strong>Status:</strong> ${order.status}</p>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage customer orders</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchOrders} className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 transition" title="Refresh">
            <RefreshCw size={18} />
          </button>
          <button onClick={() => navigate('/orders/add')} className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium border border-primary hover:bg-primary-dark transition">
            <Plus size={18} /> New Order
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); pagination.goToPage(1); }}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:border-primary outline-none transition"
        >
          <option value="">All Statuses</option>
          {Object.values(ORDER_STATUS).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartChange={(v) => { setStartDate(v); pagination.goToPage(1); }}
          onEndChange={(v) => { setEndDate(v); pagination.goToPage(1); }}
        />
      </div>

      <OrderTable
        orders={orders}
        loading={loading}
        onView={(row) => navigate(`/orders/${row.orderId}`)}
        onUpdateStatus={handleUpdateStatus}
        onCancel={setCancelTarget}
        onPrint={handlePrintInvoice}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
      />

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        paginationRange={pagination.paginationRange}
        onPageChange={pagination.goToPage}
      />

      <ConfirmDialog
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
        title="Cancel Order"
        message={`Are you sure you want to cancel Order #${cancelTarget?.orderId}? This will restore stock quantities.`}
        confirmText="Cancel Order"
        variant="danger"
      />
    </div>
  );
}
