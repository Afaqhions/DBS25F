import { createContext, useCallback } from 'react';
import toast from 'react-hot-toast';

export const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const options = { duration };
    switch (type) {
      case 'success':
        toast.success(message, options);
        break;
      case 'error':
        toast.error(message, options);
        break;
      case 'warning':
        toast(message, { ...options, icon: '⚠️' });
        break;
      default:
        toast(message, options);
    }
  }, []);

  return (
    <NotificationContext.Provider value={{ showToast }}>
      {children}
    </NotificationContext.Provider>
  );
}
