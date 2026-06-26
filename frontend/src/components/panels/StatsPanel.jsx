import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatsPanel({ title, value, subtitle, icon: Icon, trend, trendValue, color = 'primary' }) {
  const colorMap = {
    primary: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    secondary: 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    accent: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    danger: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-3 ${colorMap[color] || colorMap.primary}`}>
            <Icon size={24} />
          </div>
        )}
      </div>
      {trend !== undefined && (
        <div className="mt-3 flex items-center gap-1 text-xs">
          {trend >= 0 ? (
            <TrendingUp size={14} className="text-green-500" />
          ) : (
            <TrendingDown size={14} className="text-red-500" />
          )}
          <span className={trend >= 0 ? 'text-green-600' : 'text-red-600'}>
            {Math.abs(trend)}% {trend >= 0 ? 'increase' : 'decrease'}
          </span>
          <span className="text-gray-400 ml-1">{trendValue}</span>
        </div>
      )}
    </div>
  );
}
