import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerSchema } from '../../utils/validators';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function CustomerForm({ defaultValues, onSubmit, loading, onCancel }) {
  const [activePanel, setActivePanel] = useState('personal');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      isActive: true,
      address: '',
      ...defaultValues,
    },
  });

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      dateOfBirth: data.dateOfBirth === '' ? null : data.dateOfBirth,
    });
  };

  const panels = [
    {
      id: 'personal',
      title: 'Personal Information',
      fields: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name *</label>
            <input {...register('fullName')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:border-primary outline-none transition" />
            {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email *</label>
            <input {...register('email')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:border-primary outline-none transition" />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
            <input {...register('phone')} placeholder="+1 (555) 123-4567" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:border-primary outline-none transition" />
            {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth</label>
            <input type="date" {...register('dateOfBirth')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:border-primary outline-none transition" />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
            <div className="flex items-center gap-4 mt-2">
              {['Male', 'Female', 'Other'].map((g) => (
                <label key={g} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input type="radio" value={g} {...register('gender')} className="accent-primary" />
                  {g}
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
            <div className="flex items-center gap-3 mt-2">
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                <input type="checkbox" {...register('isActive')} className="accent-primary" />
                Is Active
              </label>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'address',
      title: 'Address & Preferences',
      fields: (
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
            <textarea {...register('address')} rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:border-primary outline-none transition resize-none" />
            {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
          </div>
        </div>
      ),
    },
  ];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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
          {defaultValues?.id ? 'Update Customer' : 'Create Customer'}
        </button>
      </div>
    </form>
  );
}
