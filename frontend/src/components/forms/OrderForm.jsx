import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { orderSchema } from '../../utils/validators';
import { customersAPI } from '../../api/customers';
import { productsAPI } from '../../api/products';
import { formatCurrency } from '../../utils/formatters';
import { PAYMENT_METHODS } from '../../utils/constants';
import { ChevronDown, ChevronUp, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrderForm({ onSubmit, loading, onCancel }) {
  const [activePanel, setActivePanel] = useState('customer');
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [productSearch, setProductSearch] = useState('');

  useEffect(() => {
    Promise.all([
      customersAPI.getAll({ page: 1, pageSize: 100 }),
      productsAPI.getAll({ page: 1, pageSize: 200 }),
    ]).then(([custRes, prodRes]) => {
      const custData = custRes.data.data?.items || custRes.data.items || custRes.data || [];
      const prodData = prodRes.data.data?.items || prodRes.data.items || prodRes.data || [];
      setCustomers(custData);
      setProducts(prodData);
    }).catch(() => {});
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerId: '',
      paymentMethod: 'Cash',
      items: [],
      remarks: '',
    },
  });

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(productSearch.toLowerCase()) && p.status === 'Active'
  );

  const addItem = useCallback((product) => {
    setOrderItems((prev) => {
      const existing = prev.find((i) => i.productId === product.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.productId
            ? { ...i, quantity: i.quantity + 50 }
            : i
        );
      }
      return [...prev, {
        productId: product.productId,
        productName: product.name,
        unitPrice: product.price,
        quantity: 50,
      }];
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setOrderItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId, qty) => {
    setOrderItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, quantity: Math.max(50, parseInt(qty) || 50) } : i
      )
    );
  }, []);

  const total = orderItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const handleFormSubmit = (data) => {
    if (orderItems.length === 0) {
      toast.error('At least one item is required');
      return;
    }
    onSubmit({
      ...data,
      items: orderItems.map(({ productId, quantity }) => ({ productId: parseInt(productId), quantity })),
    });
  };

  const panels = [
    {
      id: 'customer',
      title: 'Customer Information',
      fields: (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Customer *</label>
            <select {...register('customerId')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:border-primary outline-none transition">
              <option value="">-- Select Customer --</option>
              {customers.map((c) => (
                <option key={c.customerId} value={c.customerId}>{c.fullName} ({c.email})</option>
              ))}
            </select>
            {errors.customerId && <p className="text-xs text-red-500">{errors.customerId.message}</p>}
          </div>
        </div>
      ),
    },
    {
      id: 'items',
      title: 'Order Items',
      fields: (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="Search products by name..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:border-primary outline-none transition"
            />
          </div>

          <div className="max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-700">
            {filteredProducts.slice(0, 20).map((product) => (
              <button
                key={product.productId}
                type="button"
                onClick={() => addItem(product)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-0 transition"
              >
                <span className="font-medium">{product.name}</span>
                <span className="text-gray-500">{formatCurrency(product.price)} | Stock: {product.stockQuantity}</span>
              </button>
            ))}
            {filteredProducts.length === 0 && (
              <p className="p-3 text-sm text-gray-500 text-center">No products found</p>
            )}
          </div>

          {orderItems.length > 0 && (
            <div className="overflow-x-auto border border-gray-200 dark:border-gray-700">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-gray-500">Product</th>
                    <th className="px-3 py-2 text-right font-medium text-gray-500">Price</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-500">Qty</th>
                    <th className="px-3 py-2 text-right font-medium text-gray-500">Subtotal</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {orderItems.map((item) => (
                    <tr key={item.productId}>
                      <td className="px-3 py-2 font-medium">{item.productName}</td>
                      <td className="px-3 py-2 text-right">{formatCurrency(item.unitPrice)}</td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min="50"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.productId, e.target.value)}
                          className="w-16 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                        />
                      </td>
                      <td className="px-3 py-2 text-right font-medium">{formatCurrency(item.unitPrice * item.quantity)}</td>
                      <td className="px-3 py-2">
                        <button type="button" onClick={() => removeItem(item.productId)} className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <td colSpan="3" className="px-3 py-2 text-right font-semibold">Total:</td>
                    <td className="px-3 py-2 text-right font-bold text-primary">{formatCurrency(total)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
          {orderItems.length === 0 && (
            <p className="p-3 text-sm text-amber-600 dark:text-amber-400 text-center">Add at least one item to the order</p>
          )}
        </div>
      ),
    },
    {
      id: 'payment',
      title: 'Payment',
      fields: (
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method *</label>
            <div className="flex items-center gap-6 mt-2">
              {PAYMENT_METHODS.map((method) => (
                <label key={method} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input
                    type="radio"
                    value={method}
                    {...register('paymentMethod')}
                    className="accent-primary"
                  />
                  {method}
                </label>
              ))}
            </div>
            {errors.paymentMethod && <p className="text-xs text-red-500">{errors.paymentMethod.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Remarks</label>
            <textarea {...register('remarks')} rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:border-primary outline-none transition resize-none" />
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
        <button type="submit" disabled={loading || orderItems.length === 0} className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark transition disabled:opacity-50 flex items-center gap-2">
          {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />}
          Place Order ({formatCurrency(total)})
        </button>
      </div>
    </form>
  );
}
