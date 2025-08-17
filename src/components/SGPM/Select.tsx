import React from 'react';

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  className?: string;
  disabled?: boolean;
}

export const Select: React.FC<SelectProps> = ({ value, onChange, options, placeholder, className, disabled = false }) => (
  <div className="relative group">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`
        w-64 h-12 pl-4 pr-10 bg-white rounded-xl border border-gray-200 shadow-sm appearance-none text-gray-700
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        transition-all duration-300 hover:border-blue-300
        ${disabled ? 'cursor-not-allowed opacity-50 bg-gray-100' : 'cursor-pointer'}
        ${className || ''}
      `}
    >
      <option value="">{placeholder}</option>
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <div className={`absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none transition-colors duration-300 ${
      disabled ? 'text-gray-300' : 'text-gray-400 group-hover:text-blue-500'
    }`}>
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
);
