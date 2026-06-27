import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { countrySchema } from '../../utils/validators';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function CountryForm({ defaultValues, onSubmit, loading, onCancel }) {
  const [activePanel, setActivePanel] = useState('details');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(countrySchema),
    defaultValues: {
      name: '',
      code: '',
      continent: '',
      currency: '',
      ...defaultValues,
    },
  });

  const panels = [
    {
      id: 'details',
      title: 'Country Information',
      fields: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Country Name *</label>
            <input {...register('name')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:border-primary outline-none transition" />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Code *</label>
            <input {...register('code')} placeholder="e.g. US, PK" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:border-primary outline-none transition" />
            {errors.code && <p className="text-xs text-red-500">{errors.code.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Continent</label>
            <input {...register('continent')} placeholder="e.g. Asia, Europe" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:border-primary outline-none transition" />
            {errors.continent && <p className="text-xs text-red-500">{errors.continent.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Currency *</label>
            <input {...register('currency')} placeholder="e.g. USD, PKR" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:border-primary outline-none transition" />
            {errors.currency && <p className="text-xs text-red-500">{errors.currency.message}</p>}
          </div>
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
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark transition disabled:opacity-50 flex items-center gap-2">
          {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />}
          {defaultValues?.countryId ? 'Update Country' : 'Create Country'}
        </button>
      </div>
    </form>
  );
}
