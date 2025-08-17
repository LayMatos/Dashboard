import React from 'react';

interface StatsCardProps {
  title: string;
  value: number | string;
  className?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  className = '',
  icon,
  trend 
}) => (
  <div 
    className={`
      bg-white p-6 rounded-xl shadow-lg 
      hover:shadow-2xl transition-all duration-300 ease-in-out
      transform hover:-translate-y-1
      border border-gray-100
      ${className}
    `}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        {icon && (
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      {trend && (
        <div className={`
          flex items-center px-2 py-1 rounded-full text-sm
          ${trend.isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}
        `}>
          <span>{trend.isPositive ? '↑' : '↓'}</span>
          <span className="ml-1">{trend.value}%</span>
        </div>
      )}
    </div>
    <div className="mt-2">
      <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        {value}
      </p>
    </div>
  </div>
); 