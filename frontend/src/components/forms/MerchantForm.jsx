import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { merchantSchema } from '../../utils/validators';
import { countriesAPI } from '../../api/countries';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function MerchantForm({ defaultValues, onSubmit, loading, onCancel }) {
  const [activePanel, setActivePanel] = useState('details');
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    countriesAPI.getAll()
      .then((res) => {
        const data = res.data.data || res.data;
        setCountries(Array.isArray(data) ? data : []);
      })
      .catch(() => {});
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(merchantSchema),
    defaultValues: {
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      countryId: '',
      ...defaultValues,
    },
  });

  const panels = [
    {
      id: 'details',
      title: 'Merchant Information',
      fields: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Name *</label>
            <input {...register('companyName')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:border-primary outline-none transition" />
            {errors.companyName && <p className="text-xs text-red-500">{errors.companyName.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Person</label>
            <input {...register('contactPerson')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:border-primary outline-none transition" />
            {errors.contactPerson && <p className="text-xs text-red-500">{errors.contactPerson.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email *</label>
            <input {...register('email')} type="email" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:border-primary outline-none transition" />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
            <input {...register('phone')} placeholder="+1 (555) 123-4567" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:border-primary outline-none transition" />
            {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Country *</label>
            <select {...register('countryId')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:border-primary outline-none transition">
              <option value="">-- Select Country --</option>
              {countries.map((c) => (
                <option key={c.countryId} value={c.countryId}>{c.name} ({c.code})</option>
              ))}
            </select>
            {errors.countryId && <p className="text-xs text-red-500">{errors.countryId.message}</p>}
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
          {defaultValues?.merchantId ? 'Update Merchant' : 'Create Merchant'}
        </button>
      </div>
    </form>
  );
}
