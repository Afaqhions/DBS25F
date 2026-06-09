import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductForm from '../components/forms/ProductForm';
import { productsAPI } from '../api/products';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function ProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [defaultValues, setDefaultValues] = useState(null);

  useEffect(() => {
    if (isEdit) {
      setFetching(true);
      productsAPI.getById(id)
        .then((res) => {
          const data = res.data.data || res.data;
          setDefaultValues({
            name: data.name || '',
            description: data.description || '',
            price: data.price?.toString() || '',
            stockQuantity: data.stockQuantity?.toString() || '0',
            categoryId: data.categoryId?.toString() || '',
            id: data.productId,
          });
        })
        .catch(() => {
          toast.error('Failed to load product');
          navigate('/products');
        })
        .finally(() => setFetching(false));
    }
  }, [id, isEdit, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        name: data.name,
        description: data.description || null,
        price: parseFloat(data.price),
        stockQuantity: parseInt(data.stockQuantity),
        categoryId: parseInt(data.categoryId),
      };

      if (isEdit) {
        await productsAPI.update(id, payload);
        toast.success('Product updated successfully');
      } else {
        await productsAPI.create(payload);
        toast.success('Product created successfully');
      }
      navigate('/products');
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} product`);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <LoadingSpinner text="Loading product..." />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isEdit ? 'Edit Product' : 'Add Product'}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {isEdit ? 'Update product information' : 'Create a new product'}
        </p>
      </div>

      <ProductForm
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        loading={loading}
        onCancel={() => navigate('/products')}
      />
    </div>
  );
}
