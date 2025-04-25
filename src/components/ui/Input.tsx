import React, { useEffect } from 'react';
import { validateField } from '@/helpers/validation';

type InputProps = {
  type?: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValidate?: (error: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  rules?: Array<'required' | 'number' | { min: number } | { max: number } | any>;
  context?: { title?: string };
  min?: number;
  max?: number;
  className?: string;
};

export const Input = ({
  type = 'text',
  name,
  value,
  onChange,
  onValidate,
  label,
  placeholder,
  error,
  rules = [],
  context,
  min,
  max,
  className = ''
}: InputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    
    if (onValidate && rules.length > 0) {
      const errorMsg = validateField(e.target.value, rules, context);
      onValidate(errorMsg);
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
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        min={min}
        max={max}
        className={`w-full p-2 border rounded ${error ? 'border-red-500' : ''} ${className}`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};
