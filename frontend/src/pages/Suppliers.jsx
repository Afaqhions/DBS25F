import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/tables/DataTable';
import Pagination from '../components/common/Pagination';
import SearchBar from '../components/common/SearchBar';
import ConfirmDialog from '../components/common/ConfirmDialog';
import SupplierForm from '../components/forms/SupplierForm';
import { suppliersAPI } from '../api/suppliers';
import { useDebounce } from '../hooks/useDebounce';
import { usePagination } from '../hooks/usePagination';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, RefreshCw, Truck } from 'lucide-react';

export default function Suppliers() {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const debouncedSearch = useDebounce(search, 400);
  const pagination = usePagination({ totalCount, pageSize: 10 });

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: pagination.currentPage, pageSize: 10 };
      if (debouncedSearch) params.search = debouncedSearch;
      const res = await suppliersAPI.getAll(params);
      const data = res.data.data || res.data;
      setSuppliers(data.items || []);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      toast.error('Failed to load suppliers');
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, debouncedSearch]);

  useEffect(() => { fetchSuppliers(); }, [fetchSuppliers]);

  const handleEdit = (row) => {
    setEditTarget(row);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditTarget(null);
    setShowForm(true);
  };

  const handleFormSubmit = async (data) => {
    setFormLoading(true);
    try {
      if (editTarget) {
        await suppliersAPI.update(editTarget.supplierId, {
          ...data,
          isActive: editTarget.isActive,
        });
        toast.success('Supplier updated successfully');
      } else {
        await suppliersAPI.create(data);
        toast.success('Supplier created successfully');
      }
      setShowForm(false);
      setEditTarget(null);
      fetchSuppliers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save supplier');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await suppliersAPI.delete(deleteTarget.supplierId);
      toast.success('Supplier deactivated successfully');
      setDeleteTarget(null);
      fetchSuppliers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to deactivate supplier');
    }
  };

  const columns = [
    { key: 'companyName', label: 'Company', render: (r) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 flex items-center justify-center"><Truck size={16} className="text-gray-500" /></div>
        <span className="font-medium">{r.companyName}</span>
      </div>
    )},
    { key: 'contactPerson', label: 'Contact', hidden: true },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone', hidden: true },
    { key: 'isActive', label: 'Status', render: (r) => (
      <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${r.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800'}`}>
        {r.isActive ? 'Active' : 'Inactive'}
      </span>
    )},
  ];

  const actions = (row) => (
    <>
      <button onClick={() => handleEdit(row)} className="p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 border border-transparent hover:border-amber-300 dark:hover:border-amber-800 transition" title="Edit">
        <Edit2 size={16} />
      </button>
      <button onClick={() => setDeleteTarget(row)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 border border-transparent hover:border-red-300 dark:hover:border-red-800 transition" title="Deactivate">
        <Trash2 size={16} />
      </button>
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Suppliers</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage product suppliers</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchSuppliers} className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 transition">
            <RefreshCw size={18} />
          </button>
          <button onClick={handleCreate} className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium border border-primary hover:bg-primary-dark transition">
            <Plus size={18} /> Add Supplier
          </button>
        </div>
      </div>

      {showForm ? (
        <div className="max-w-2xl">
          <SupplierForm
            defaultValues={editTarget ? {
              companyName: editTarget.companyName,
              contactPerson: editTarget.contactPerson || '',
              email: editTarget.email,
              phone: editTarget.phone || '',
              address: editTarget.address || '',
            } : null}
            onSubmit={handleFormSubmit}
            loading={formLoading}
            onCancel={() => { setShowForm(false); setEditTarget(null); }}
          />
        </div>
      ) : (
        <>
          <SearchBar value={search} onChange={setSearch} placeholder="Search suppliers..." className="max-w-md" />

          <DataTable
            columns={columns}
            data={suppliers}
            loading={loading}
            actions={actions}
            emptyMessage="No suppliers found"
          />

          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            paginationRange={pagination.paginationRange}
            onPageChange={pagination.goToPage}
          />
        </>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Deactivate Supplier"
        message={`Are you sure you want to deactivate ${deleteTarget?.companyName}?`}
        confirmText="Deactivate"
        variant="danger"
      />
    </div>
  );
}
