import DataTable from './DataTable';
import { Edit2, Trash2, Package } from 'lucide-react';
import { formatCurrency, formatStockLevel } from '../../utils/formatters';

export default function ProductTable({ products, loading, onEdit, onDelete, sortColumn, sortDirection, onSort }) {
  const columns = [
    {
      key: 'name',
      label: 'Product',
      sortable: true,
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
            <Package size={20} className="text-gray-400" />
          </div>
          <div>
            <p className="font-medium">{r.name}</p>
            <p className="text-xs text-gray-500">{r.categoryName}</p>
          </div>
        </div>
      ),
    },
    { key: 'categoryName', label: 'Category', hidden: true },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (r) => formatCurrency(r.price),
      className: 'text-right',
    },
    {
      key: 'stockQuantity',
      label: 'Stock',
      sortable: true,
      className: 'text-center',
      render: (r) => {
        const stock = formatStockLevel(r.stockQuantity);
        return <span className={stock.class}>{stock.label}</span>;
      },
    },
    { key: 'status', label: 'Status', hidden: true, render: (r) => <span className={r.status === 'Active' ? 'text-green-600' : 'text-red-600'}>{r.status}</span> },
  ];

  const actions = (row) => (
    <>
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
      data={products}
      loading={loading}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      onSort={onSort}
      actions={actions}
      emptyMessage="No products found"
    />
  );
}
