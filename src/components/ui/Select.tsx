import React from 'react';
import { validateField } from '@/helpers/validation';

type SelectProps = {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onValidate?: (error: string) => void;
  label?: string;
  error?: string;
  rules?: Array<'required'>;
  context?: { title?: string };
  options: Array<{ value: string; label: string }>;
  className?: string;
};

export const Select = ({
  name,
  value,
  onChange,
  onValidate,
  label,
  error,
  rules = [],
  context,
  options,
  className = ''
}: SelectProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e);
    
    if (onValidate && rules.length > 0) {
      const error = validateField(e.target.value, rules, context);
      onValidate(error);
    }
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium mb-2">
          {label}
          {rules.includes('required') && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={handleChange}
        className={`w-full p-2 border rounded ${error ? 'border-red-500' : ''} ${className}`}
      >
        <option value="">Chọn {label?.toLowerCase()}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};
