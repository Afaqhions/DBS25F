import { Link } from 'react-router-dom';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDown, LayoutDashboard, Users, Tag, Package, ShoppingCart, Truck, BarChart3, Download, Printer, RefreshCw, HelpCircle, Info, Keyboard } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const menuStructure = [
  {
    label: 'File',
    items: [
      { label: 'Dashboard', path: '/', icon: LayoutDashboard },
      { label: 'Customers', path: '/customers', icon: Users },
      { label: 'Categories', path: '/categories', icon: Tag },
      { label: 'Products', path: '/products', icon: Package },
      { label: 'Orders', path: '/orders', icon: ShoppingCart },
      { label: 'Suppliers', path: '/suppliers', icon: Truck },
      { label: 'Reports', path: '/reports', icon: BarChart3 },
    ],
  },
  {
    label: 'Actions',
    items: [
      { label: 'Export PDF', icon: Download, action: 'export-pdf' },
      { label: 'Export Excel', icon: Download, action: 'export-excel' },
      { label: 'Print', icon: Printer, action: 'print' },
      { label: 'Refresh', icon: RefreshCw, action: 'refresh' },
    ],
  },
  {
    label: 'Help',
    items: [
      { label: 'Documentation', icon: HelpCircle, action: 'docs' },
      { label: 'About', icon: Info, action: 'about' },
      { label: 'Keyboard Shortcuts', icon: Keyboard, action: 'shortcuts' },
    ],
  },
];

export default function FileMenu({ onAction, onRefresh }) {
  const { darkMode, toggleDarkMode } = useTheme();

  const handleAction = (action) => {
    if (action === 'print') {
      window.print();
    } else if (action === 'refresh' && onRefresh) {
      onRefresh();
    } else if (action === 'about') {
      alert('Wholesale Management System v1.0\nCMPE-341 Database Systems Lab Project');
    } else if (action === 'shortcuts') {
      alert('Keyboard Shortcuts:\n\nCtrl+N - New Record\nCtrl+S - Save\nF5 - Refresh\nCtrl+P - Print\nCtrl+F - Search');
    } else if (action === 'docs') {
      window.open('#', '_blank');
    } else if (action === 'export-pdf') {
      window.print();
    } else if (action === 'export-excel') {
      alert('Excel export functionality - implement based on your backend capability.');
    } else if (onAction) {
      onAction(action);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {menuStructure.map((menu) => (
        <Menu key={menu.label} as="div" className="relative">
          <MenuButton className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            {menu.label}
            <ChevronDown size={14} />
          </MenuButton>
          <MenuItems
            anchor="bottom start"
            className="mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-1 z-50"
          >
            {menu.items.map((item) => (
              <MenuItem key={item.label}>
                {({ active }) =>
                  item.path ? (
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-2 text-sm ${
                        active ? 'bg-gray-100 dark:bg-gray-700' : ''
                      } text-gray-700 dark:text-gray-300`}
                    >
                      <item.icon size={16} />
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleAction(item.action)}
                      className={`flex items-center gap-3 px-4 py-2 text-sm w-full text-left ${
                        active ? 'bg-gray-100 dark:bg-gray-700' : ''
                      } text-gray-700 dark:text-gray-300`}
                    >
                      <item.icon size={16} />
                      {item.label}
                    </button>
                  )
                }
              </MenuItem>
            ))}
          </MenuItems>
        </Menu>
      ))}

      <button
        onClick={toggleDarkMode}
        className="ml-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        title="Toggle Dark Mode"
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
    </div>
  );
}
