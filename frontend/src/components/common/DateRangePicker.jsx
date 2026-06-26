import { Calendar } from 'lucide-react';

export default function DateRangePicker({ startDate, endDate, onStartChange, onEndChange, className = '' }) {
  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-2 ${className}`}>
      <div className="relative flex-1 w-full">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartChange(e.target.value)}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:border-primary outline-none transition"
        />
      </div>
      <span className="text-gray-500 text-sm hidden sm:inline">to</span>
      <div className="relative flex-1 w-full">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndChange(e.target.value)}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:border-primary outline-none transition"
        />
      </div>
    </div>
  );
}
