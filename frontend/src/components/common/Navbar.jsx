import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import FileMenu from './FileMenu';
import { LogOut, Moon, Sun, Bell, User } from 'lucide-react';

export default function Navbar({ onRefresh, title }) {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-4">
          <FileMenu onRefresh={onRefresh} />
          {title && (
            <span className="hidden md:inline text-sm font-medium text-gray-500 dark:text-gray-400">
              / {title}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500"></span>
          </button>

          <button
            onClick={toggleDarkMode}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            title="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="flex items-center gap-2 pl-3 border-l border-gray-200 dark:border-gray-700">
            <div className="w-8 h-8 bg-primary flex items-center justify-center text-white text-sm font-medium">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200 leading-tight">{user?.username || 'User'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role || 'Staff'}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
