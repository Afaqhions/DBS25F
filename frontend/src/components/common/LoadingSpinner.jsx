import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ size = 24, text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <Loader2 className="animate-spin text-primary" size={size} />
      {text && <p className="text-sm text-gray-500 dark:text-gray-400">{text}</p>}
    </div>
  );
}
