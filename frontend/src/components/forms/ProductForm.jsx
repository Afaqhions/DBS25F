import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema } from '../../utils/validators';
import { categoriesAPI } from '../../api/categories';
import { suppliersAPI } from '../../api/suppliers';
import { ChevronDown, ChevronUp, Truck } from 'lucide-react';

export default function ProductForm({ defaultValues, onSubmit, loading, onCancel }) {
  const [activePanel, setActivePanel] = useState('basic');
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    categoriesAPI.getAll()
      .then((res) => setCategories(res.data.data || res.data))
      .catch(() => setCategories([]));
    suppliersAPI.getAll({ page: 1, pageSize: 100 })
      .then((res) => {
        const data = res.data.data || res.data;
        setSuppliers(data.items || []);
      })
      .catch(() => setSuppliers([]));
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      stockQuantity: '0',
      categoryId: '',
      ...defaultValues,
    },
  });

  const panels = [
    {
      id: 'basic',
      title: 'Basic Information',
      fields: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product Name *</label>
            <input {...register('name')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:border-primary outline-none transition" />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea {...register('description')} rows={4} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:border-primary outline-none transition resize-none" />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price *</label>
            <input type="number" step="0.01" min="0" {...register('price')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:border-primary outline-none transition" />
            {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category *</label>
            <select {...register('categoryId')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:border-primary outline-none transition">
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>
              ))}
            </select>
            {errors.categoryId && <p className="text-xs text-red-500">{errors.categoryId.message}</p>}
          </div>
        </div>
      ),
    },
    {
      id: 'inventory',
      title: 'Inventory',
      fields: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stock Quantity *</label>
            <input type="number" min="0" {...register('stockQuantity')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:border-primary outline-none transition" />
            {errors.stockQuantity && <p className="text-xs text-red-500">{errors.stockQuantity.message}</p>}
          </div>
        </div>
      ),
    },
    {
      id: 'supplier',
      title: 'Supplier Panel',
      fields: (
        <div className="space-y-3">
          <p className="text-xs text-gray-500">Available suppliers for this product. Assign suppliers via inventory transactions.</p>
          {suppliers.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">No suppliers available. Add suppliers from the Suppliers page.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {suppliers.filter((s) => s.isActive !== false).map((supplier) => (
                <div key={supplier.supplierId} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <div className="w-8 h-8 bg-primary/10 flex items-center justify-center">
                    <Truck size={16} className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{supplier.companyName}</p>
                    <p className="text-xs text-gray-500 truncate">{supplier.contactPerson || supplier.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {panels.map((panel) => (
        <div key={panel.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => setActivePanel(activePanel === panel.id ? '' : panel.id)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/50 text-left"
          >
            <span className="font-medium text-sm text-gray-800 dark:text-white">{panel.title}</span>
            {activePanel === panel.id ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
          </button>
          {activePanel === panel.id && <div className="p-4">{panel.fields}</div>}
        </div>
      ))}

      <div className="flex items-center justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark border border-primary transition disabled:opacity-50 flex items-center gap-2">
          {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />}
          {defaultValues?.id ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}
