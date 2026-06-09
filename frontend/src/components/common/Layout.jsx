import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { Menu } from 'lucide-react';

const pageTitles = {
  '/': 'Dashboard',
  '/customers': 'Customers',
  '/customers/add': 'Add Customer',
  '/categories': 'Categories',
  '/products': 'Products',
  '/products/add': 'Add Product',
  '/orders': 'Orders',
  '/orders/add': 'New Order',
  '/suppliers': 'Suppliers',
  '/reports': 'Reports',
  '/settings': 'Settings',
};

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const path = location.pathname;
  const editMatch = path.match(/^\/(customers|products)\/edit\/(\d+)$/);
  const detailMatch = path.match(/^\/orders\/(\d+)$/);
  let title = pageTitles[path] || '';
  if (editMatch) {
    const entity = editMatch[1];
    title = `Edit ${entity === 'customers' ? 'Customer' : 'Product'}`;
  } else if (detailMatch) {
    title = `Order #${detailMatch[1]}`;
  }

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onRefresh={handleRefresh} title={title} />

        <div className="lg:hidden fixed bottom-4 right-4 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-12 h-12 bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition border border-primary"
          >
            <Menu size={24} />
          </button>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}
