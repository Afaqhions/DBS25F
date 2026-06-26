import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderForm from '../components/forms/OrderForm';
import { ordersAPI } from '../api/orders';
import toast from 'react-hot-toast';

export default function OrderFormPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        customerId: parseInt(data.customerId),
        paymentMethod: data.paymentMethod,
        items: data.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };
      const res = await ordersAPI.create(payload);
      const orderId = res.data.data?.orderId || res.data?.orderId;
      toast.success('Order created successfully!');
      if (orderId) {
        navigate(`/orders/${orderId}`);
      } else {
        navigate('/orders');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create order';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">New Order</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Create a new customer order with inventory transaction
        </p>
      </div>

      <OrderForm
        onSubmit={onSubmit}
        loading={loading}
        onCancel={() => navigate('/orders')}
      />
    </div>
  );
}
