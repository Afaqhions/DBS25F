import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatsPanel from '../components/panels/StatsPanel';
import ChartPanel from '../components/panels/ChartPanel';
import DashboardPanel from '../components/panels/DashboardPanel';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Users, Package, ShoppingCart, DollarSign, AlertTriangle, ArrowRight } from 'lucide-react';
import { ordersAPI } from '../api/orders';
import { customersAPI } from '../api/customers';
import { productsAPI } from '../api/products';
import LoadingSpinner from '../components/common/LoadingSpinner';

const statusBadgeClass = (status) => {
  const map = {
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800',
    Shipped: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800',
    Delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border border-green-200 dark:border-green-800',
    Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border border-red-200 dark:border-red-800',
    Active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border border-green-200 dark:border-green-800',
    Inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700',
    Deleted: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border border-red-200 dark:border-red-800',
    Paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border border-green-200 dark:border-green-800',
    Unpaid: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800',
  };
  return map[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700';
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      ordersAPI.getAll({ page: 1, pageSize: 5 }),
      customersAPI.getAll({ page: 1, pageSize: 1 }),
      productsAPI.getAll({ page: 1, pageSize: 1 }),
    ]).then(([ordersRes, customersRes, productsRes]) => {
      const ordersData = ordersRes.data.data || ordersRes.data;
      const orders = ordersData.items || ordersRes.data || [];
      setRecentOrders(Array.isArray(orders) ? orders.slice(0, 5) : []);

      const customersData = customersRes.data.data || customersRes.data;
      const productsData = productsRes.data.data || productsRes.data;

      const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      setStats({
        totalCustomers: customersData.totalCount || 0,
        totalProducts: productsData.totalCount || 0,
        totalOrders: ordersData.totalCount || orders.length,
        totalRevenue,
        lowStockItems: 0,
      });
    }).catch(() => {
      setStats({ totalCustomers: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0, lowStockItems: 0 });
    }).finally(() => setLoading(false));
  }, []);

  const monthlyData = [
    { month: 'Jan', sales: 0 }, { month: 'Feb', sales: 0 }, { month: 'Mar', sales: 0 },
    { month: 'Apr', sales: 0 }, { month: 'May', sales: 0 }, { month: 'Jun', sales: 0 },
  ];

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Overview of your wholesale management system</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsPanel title="Total Customers" value={stats?.totalCustomers || 0} icon={Users} color="primary" />
        <StatsPanel title="Total Products" value={stats?.totalProducts || 0} icon={Package} color="purple" />
        <StatsPanel title="Total Orders" value={stats?.totalOrders || 0} icon={ShoppingCart} color="accent" />
        <StatsPanel title="Revenue" value={formatCurrency(stats?.totalRevenue || 0)} icon={DollarSign} color="secondary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartPanel title="Monthly Sales" type="bar" data={monthlyData} dataKey="sales" xKey="month" />
        </div>
        <DashboardPanel title="Quick Actions">
          <div className="space-y-3">
            <Link to="/orders/add" className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition">
              <div className="flex items-center gap-3">
                <ShoppingCart size={18} className="text-primary" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">New Order</span>
              </div>
              <ArrowRight size={16} className="text-primary" />
            </Link>
            <Link to="/customers/add" className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/30 transition">
              <div className="flex items-center gap-3">
                <Users size={18} className="text-secondary" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Add Customer</span>
              </div>
              <ArrowRight size={16} className="text-secondary" />
            </Link>
            <Link to="/products/add" className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/30 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition">
              <div className="flex items-center gap-3">
                <Package size={18} className="text-accent" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Add Product</span>
              </div>
              <ArrowRight size={16} className="text-accent" />
            </Link>
            <Link to="/reports" className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition">
              <div className="flex items-center gap-3">
                <AlertTriangle size={18} className="text-purple-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">View Reports</span>
              </div>
              <ArrowRight size={16} className="text-purple-600" />
            </Link>
          </div>
        </DashboardPanel>
      </div>

      <DashboardPanel title="Recent Orders">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-3 font-medium text-gray-500">Order #</th>
                <th className="text-left py-3 px-3 font-medium text-gray-500 hidden md:table-cell">Customer</th>
                <th className="text-right py-3 px-3 font-medium text-gray-500">Amount</th>
                <th className="text-center py-3 px-3 font-medium text-gray-500">Status</th>
                <th className="text-right py-3 px-3 font-medium text-gray-500 hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-gray-500">No recent orders</td></tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.orderId} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="py-3 px-3 font-medium">#{order.orderId}</td>
                    <td className="py-3 px-3 text-gray-600 dark:text-gray-400 hidden md:table-cell">{order.customerName}</td>
                    <td className="py-3 px-3 text-right font-medium">{formatCurrency(order.totalAmount)}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium ${statusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-gray-500 hidden sm:table-cell">{formatDate(order.orderDate)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </DashboardPanel>
    </div>
  );
}
