import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CustomerForm from '../components/forms/CustomerForm';
import { customersAPI } from '../api/customers';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function CustomerFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [defaultValues, setDefaultValues] = useState(null);

  useEffect(() => {
    if (isEdit) {
      setFetching(true);
      customersAPI.getById(id)
        .then((res) => {
          const data = res.data.data || res.data;
          setDefaultValues({
            fullName: data.fullName || '',
            email: data.email || '',
            phone: data.phone || '',
            dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
            gender: data.gender || '',
            isActive: data.isActive ?? true,
            address: data.address || '',
            id: data.customerId,
          });
        })
        .catch(() => {
          toast.error('Failed to load customer');
          navigate('/customers');
        })
        .finally(() => setFetching(false));
    }
  }, [id, isEdit, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || null,
        dateOfBirth: data.dateOfBirth || undefined,
        address: data.address || null,
      };

      if (isEdit) {
        await customersAPI.update(id, payload);
        toast.success('Customer updated successfully');
      } else {
        await customersAPI.create({ ...payload, username: data.email.split('@')[0], password: 'Default@123' });
        toast.success('Customer created successfully');
      }
      navigate('/customers');
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} customer`);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <LoadingSpinner text="Loading customer..." />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isEdit ? 'Edit Customer' : 'Add Customer'}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {isEdit ? 'Update customer information' : 'Create a new customer account'}
        </p>
      </div>

      <CustomerForm
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        loading={loading}
        onCancel={() => navigate('/customers')}
      />
    </div>
  );
}
