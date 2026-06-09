import { useState, useEffect, useCallback } from 'react';
import { categoriesAPI } from '../api/categories';
import ConfirmDialog from '../components/common/ConfirmDialog';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, RefreshCw, Tag, X } from 'lucide-react';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await categoriesAPI.getAll();
      const data = res.data.data || res.data;
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const openCreate = () => {
    setEditTarget(null);
    setFormData({ name: '', description: '' });
    setShowForm(true);
  };

  const openEdit = (cat) => {
    setEditTarget(cat);
    setFormData({
      name: cat.name || '',
      description: cat.description || '',
    });
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    setFormLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim() || '',
      };
      if (editTarget) {
        await categoriesAPI.update(editTarget.categoryId, payload);
        toast.success('Category updated');
      } else {
        await categoriesAPI.create(payload);
        toast.success('Category created');
      }
      setShowForm(false);
      setEditTarget(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save category');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await categoriesAPI.delete(deleteTarget.categoryId);
      toast.success('Category deleted');
      setDeleteTarget(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage product categories</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchCategories} className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <RefreshCw size={18} />
          </button>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium border border-primary hover:bg-primary-dark transition">
            <Plus size={18} /> Add Category
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
              {editTarget ? 'Edit Category' : 'New Category'}
            </h3>
            <button onClick={() => { setShowForm(false); setEditTarget(null); }} className="text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name *</label>
              <input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:border-primary outline-none transition"
                placeholder="Category name"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:border-primary outline-none transition"
                placeholder="Optional description"
              />
            </div>
            <div className="md:col-span-2 flex items-center gap-3 pt-2">
              <button type="submit" disabled={formLoading} className="px-4 py-2 bg-primary text-white text-sm font-medium border border-primary hover:bg-primary-dark transition disabled:opacity-50 flex items-center gap-2">
                {formLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />}
                {editTarget ? 'Update Category' : 'Create Category'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditTarget(null); }} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-100 dark:bg-gray-700 animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Tag size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No categories found</p>
            <p className="text-sm mt-1">Click "Add Category" to create your first category.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Description</th>
                
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {categories.map((cat) => (
                  <tr key={cat.categoryId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 flex items-center justify-center">
                          <Tag size={15} className="text-primary" />
                        </div>
                        <span className="font-medium">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 hidden md:table-cell">{cat.description || '-'}</td>
                
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button onClick={() => openEdit(cat)} className="p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => setDeleteTarget(cat)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition ml-1" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? Categories with associated products cannot be deleted.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
