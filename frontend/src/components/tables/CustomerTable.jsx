import DataTable from './DataTable';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export default function CustomerTable({ customers, loading, onEdit, onDelete, onViewOrders, sortColumn, sortDirection, onSort }) {
  const columns = [
    { key: 'fullName', label: 'Full Name', sortable: true, render: (r) => <span className="font-medium">{r.fullName}</span> },
    { key: 'email', label: 'Email', sortable: true, hidden: true },
    { key: 'phone', label: 'Phone', hidden: true },
    { key: 'dateOfBirth', label: 'DOB', render: (r) => formatDate(r.dateOfBirth), hidden: true },
    { key: 'loyaltyPoints', label: 'Loyalty Pts', sortable: true, className: 'text-center', render: (r) => <span className="font-semibold text-yellow-600">{r.loyaltyPoints}</span> },
  ];

  const actions = (row) => (
    <>
      <button onClick={() => onViewOrders(row)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition" title="View Orders">
        <Eye size={16} />
      </button>
      <button onClick={() => onEdit(row)} className="p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition" title="Edit">
        <Edit2 size={16} />
      </button>
      <button onClick={() => onDelete(row)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition" title="Delete">
        <Trash2 size={16} />
      </button>
    </>
  );

  return (
    <DataTable
      columns={columns}
      data={customers}
      loading={loading}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      onSort={onSort}
      actions={actions}
      emptyMessage="No customers found"
    />
  );
}
