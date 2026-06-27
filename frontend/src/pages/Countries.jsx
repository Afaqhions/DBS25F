import { useState, useEffect, useCallback } from 'react';
import DataTable from '../components/tables/DataTable';
import SearchBar from '../components/common/SearchBar';
import ConfirmDialog from '../components/common/ConfirmDialog';
import CountryForm from '../components/forms/CountryForm';
import { countriesAPI } from '../api/countries';
import { useDebounce } from '../hooks/useDebounce';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, RefreshCw, Globe } from 'lucide-react';

export default function Countries() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const debouncedSearch = useDebounce(search, 400);

  const fetchCountries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await countriesAPI.getAll();
      const data = res.data.data || res.data;
      setCountries(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load countries');
      setCountries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCountries(); }, [fetchCountries]);

  const filteredCountries = countries.filter((c) =>
    c.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    c.code?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    c.continent?.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

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
        await countriesAPI.update(editTarget.countryId, {
          ...data,
          isActive: editTarget.isActive,
        });
        toast.success('Country updated successfully');
      } else {
        await countriesAPI.create(data);
        toast.success('Country created successfully');
      }
      setShowForm(false);
      setEditTarget(null);
      fetchCountries();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save country');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await countriesAPI.delete(deleteTarget.countryId);
      toast.success('Country deleted successfully');
      setDeleteTarget(null);
      fetchCountries();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete country');
    }
  };

  const columns = [
    { key: 'name', label: 'Country', render: (r) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 flex items-center justify-center"><Globe size={16} className="text-gray-500" /></div>
        <span className="font-medium">{r.name}</span>
      </div>
    )},
    { key: 'code', label: 'Code' },
    { key: 'continent', label: 'Continent' },
    { key: 'currency', label: 'Currency' },
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
      <button onClick={() => setDeleteTarget(row)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 border border-transparent hover:border-red-300 dark:hover:border-red-800 transition" title="Delete">
        <Trash2 size={16} />
      </button>
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Countries</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage countries and regions</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchCountries} className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 transition">
            <RefreshCw size={18} />
          </button>
          <button onClick={handleCreate} className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium border border-primary hover:bg-primary-dark transition">
            <Plus size={18} /> Add Country
          </button>
        </div>
      </div>

      {showForm ? (
        <div className="max-w-2xl">
          <CountryForm
            defaultValues={editTarget ? {
              name: editTarget.name,
              code: editTarget.code,
              continent: editTarget.continent || '',
              currency: editTarget.currency,
              countryId: editTarget.countryId,
            } : null}
            onSubmit={handleFormSubmit}
            loading={formLoading}
            onCancel={() => { setShowForm(false); setEditTarget(null); }}
          />
        </div>
      ) : (
        <>
          <SearchBar value={search} onChange={setSearch} placeholder="Search countries..." className="max-w-md" />

          <DataTable
            columns={columns}
            data={filteredCountries}
            loading={loading}
            actions={actions}
            emptyMessage="No countries found"
          />
        </>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Country"
        message={`Are you sure you want to delete ${deleteTarget?.name}? This will fail if active merchants are linked to this country.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
