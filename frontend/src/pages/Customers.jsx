import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerTable from '../components/tables/CustomerTable';
import Pagination from '../components/common/Pagination';
import SearchBar from '../components/common/SearchBar';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { customersAPI } from '../api/customers';
import { useDebounce } from '../hooks/useDebounce';
import { usePagination } from '../hooks/usePagination';
import toast from 'react-hot-toast';
import { Plus, RefreshCw } from 'lucide-react';

export default function Customers() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [sortColumn, setSortColumn] = useState('fullName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const debouncedSearch = useDebounce(search, 400);
  const pagination = usePagination({ totalCount, pageSize: 10 });

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.currentPage,
        pageSize: 10,
        sortColumn,
        sortDirection,
      };
      if (debouncedSearch) params.search = debouncedSearch;
      const res = await customersAPI.getAll(params);
      const data = res.data.data || res.data;
      setCustomers(data.items || []);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      toast.error('Failed to load customers');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, debouncedSearch, sortColumn, sortDirection]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection((d) => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await customersAPI.delete(deleteTarget.customerId);
      toast.success('Customer deleted successfully');
      setDeleteTarget(null);
      fetchCustomers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete customer');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customers</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your customers</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchCustomers} className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 transition" title="Refresh">
            <RefreshCw size={18} />
          </button>
          <button onClick={() => navigate('/customers/add')} className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium border border-primary hover:bg-primary-dark transition">
            <Plus size={18} /> Add Customer
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search customers..." className="flex-1" />
      </div>

      <CustomerTable
        customers={customers}
        loading={loading}
        onEdit={(row) => navigate(`/customers/edit/${row.customerId}`)}
        onDelete={setDeleteTarget}
        onViewOrders={(row) => navigate(`/orders?customerId=${row.customerId}`)}
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
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Customer"
        message={`Are you sure you want to delete ${deleteTarget?.fullName}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
