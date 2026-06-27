import { useState, useEffect, useCallback } from 'react';
import DataTable from '../components/tables/DataTable';
import SearchBar from '../components/common/SearchBar';
import ConfirmDialog from '../components/common/ConfirmDialog';
import MerchantForm from '../components/forms/MerchantForm';
import { merchantsAPI } from '../api/merchants';
import { countriesAPI } from '../api/countries';
import { useDebounce } from '../hooks/useDebounce';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, RefreshCw, Store } from 'lucide-react';

export default function Merchants() {
  const [merchants, setMerchants] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const debouncedSearch = useDebounce(search, 400);

  const fetchMerchants = useCallback(async () => {
    setLoading(true);
    try {
      const res = await merchantsAPI.getAll();
      const data = res.data.data || res.data;
      setMerchants(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load merchants');
      setMerchants([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMerchants();
    countriesAPI.getAll()
      .then((res) => {
        const data = res.data.data || res.data;
        setCountries(Array.isArray(data) ? data : []);
      })
      .catch(() => {});
  }, [fetchMerchants]);

  const filteredMerchants = merchants.filter((m) => {
    const matchesSearch = m.companyName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      m.contactPerson?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      m.email?.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesCountry = !countryFilter || m.countryId?.toString() === countryFilter;
    return matchesSearch && matchesCountry;
  });

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
      const payload = { ...data, countryId: parseInt(data.countryId) };
      if (editTarget) {
        await merchantsAPI.update(editTarget.merchantId, {
          ...payload,
          isActive: editTarget.isActive,
        });
        toast.success('Merchant updated successfully');
      } else {
        await merchantsAPI.create(payload);
        toast.success('Merchant created successfully');
      }
      setShowForm(false);
      setEditTarget(null);
      fetchMerchants();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save merchant');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await merchantsAPI.delete(deleteTarget.merchantId);
      toast.success('Merchant deactivated successfully');
      setDeleteTarget(null);
      fetchMerchants();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to deactivate merchant');
    }
  };

  const columns = [
    { key: 'companyName', label: 'Company', render: (r) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 flex items-center justify-center"><Store size={16} className="text-gray-500" /></div>
        <span className="font-medium">{r.companyName}</span>
      </div>
    )},
    { key: 'contactPerson', label: 'Contact', hidden: true },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone', hidden: true },
    { key: 'countryName', label: 'Country' },
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Merchants</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage merchants and their country associations</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchMerchants} className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 transition">
            <RefreshCw size={18} />
          </button>
          <button onClick={handleCreate} className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium border border-primary hover:bg-primary-dark transition">
            <Plus size={18} /> Add Merchant
          </button>
        </div>
      </div>

      {showForm ? (
        <div className="max-w-2xl">
          <MerchantForm
            defaultValues={editTarget ? {
              companyName: editTarget.companyName,
              contactPerson: editTarget.contactPerson || '',
              email: editTarget.email,
              phone: editTarget.phone || '',
              countryId: editTarget.countryId?.toString() || '',
              merchantId: editTarget.merchantId,
            } : null}
            onSubmit={handleFormSubmit}
            loading={formLoading}
            onCancel={() => { setShowForm(false); setEditTarget(null); }}
          />
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchBar value={search} onChange={setSearch} placeholder="Search merchants..." className="max-w-md" />
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:border-primary outline-none transition"
            >
              <option value="">All Countries</option>
              {countries.map((c) => (
                <option key={c.countryId} value={c.countryId}>{c.name}</option>
              ))}
            </select>
          </div>

          <DataTable
            columns={columns}
            data={filteredMerchants}
            loading={loading}
            actions={actions}
            emptyMessage="No merchants found"
          />
        </>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Deactivate Merchant"
        message={`Are you sure you want to deactivate ${deleteTarget?.companyName}?`}
        confirmText="Deactivate"
        variant="danger"
      />
    </div>
  );
}
