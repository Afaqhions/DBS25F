import DataTable from './DataTable';
import { Eye, Edit2, XCircle, FileText } from 'lucide-react';
import { formatCurrency, formatDate, getStatusBadgeClass } from '../../utils/formatters';

export default function OrderTable({ orders, loading, onView, onUpdateStatus, onCancel, onPrint, sortColumn, sortDirection, onSort }) {
  const columns = [
    {
      key: 'orderId',
      label: 'Order #',
      sortable: true,
      render: (r) => <span className="font-mono font-medium">#{r.orderId}</span>,
    },
    { key: 'customerName', label: 'Customer', sortable: true, hidden: true },
    { key: 'orderDate', label: 'Date', sortable: true, render: (r) => formatDate(r.orderDate) },
    {
      key: 'totalAmount',
      label: 'Total',
      sortable: true,
      render: (r) => formatCurrency(r.totalAmount),
      className: 'text-right font-medium',
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (r) => (
        <span className={`inline-block px-2.5 py-0.5 text-xs font-medium border ${getStatusBadgeClass(r.status)}`}>
          {r.status}
        </span>
      ),
    },
    { key: 'paymentMethod', label: 'Payment', hidden: true },
  ];

  const actions = (row) => (
    <>
      <button onClick={() => onView(row)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition" title="View Details">
        <Eye size={16} />
      </button>
      {row.status === 'Pending' && (
        <>
          <button onClick={() => onUpdateStatus(row, 'Shipped')} className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 transition" title="Mark Shipped">
            <Edit2 size={16} />
          </button>
          <button onClick={() => onCancel(row)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition" title="Cancel Order">
            <XCircle size={16} />
          </button>
        </>
      )}
      {row.status === 'Shipped' && (
        <button onClick={() => onUpdateStatus(row, 'Delivered')} className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 transition" title="Mark Delivered">
          <Edit2 size={16} />
        </button>
      )}
      <button onClick={() => onPrint(row)} className="p-1.5 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition" title="Print Invoice">
        <FileText size={16} />
      </button>
    </>
  );

  return (
    <DataTable
      columns={columns}
      data={orders}
      loading={loading}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      onSort={onSort}
      actions={actions}
      emptyMessage="No orders found"
    />
  );
}
