import { useState, useEffect, useRef } from 'react';
import { validateField } from '@/helpers/validation';

type MultiSelectProps = {
  options: string[];
  selected: string[] | string;
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  rules?: Array<'required'>;
  context?: { title?: string };
  forceValidate?: boolean;
};

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Select options',
  className = '',
  label,
  rules = [],
  context,
  forceValidate = false
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [internalSelected, setInternalSelected] = useState<string[]>(Array.isArray(selected) ? selected : []);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setInternalSelected(Array.isArray(selected) ? selected : []);
  }, [selected]);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option: string) => {
    const newSelected = internalSelected.includes(option)
      ? internalSelected.filter(item => item !== option)
      : [...internalSelected, option];
    
    setInternalSelected(newSelected);
    onChange(newSelected);
    
    if (rules.length > 0) {
      const valueToValidate = rules.includes('required') ? newSelected.join(',') : '';
      const errorMsg = validateField(valueToValidate, rules, context);
      setError(errorMsg);
    }
  };

  useEffect(() => {
    if (forceValidate && rules.length > 0) {
      const valueToValidate = internalSelected.length > 0 ? internalSelected.join(',') : '';
      const errorMsg = validateField(valueToValidate, rules, context);
      setError(errorMsg);
    }
  }, [forceValidate, rules, internalSelected, context]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium mb-2">
          {label}
          {rules?.includes('required') && <span className="text-red-500">*</span>}
        </label>
      )}
      <div 
        className={`flex items-center justify-between p-2 border rounded-md cursor-pointer ${error ? 'border-red-500' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">
          {internalSelected.length > 0 
            ? internalSelected.join(', ') 
            : placeholder}
        </span>
        <span>{isOpen ? '▲' : '▼'}</span>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-2 border-b"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.map(option => (
              <div 
                key={option}
                className={`p-2 cursor-pointer hover:bg-gray-100 ${internalSelected.includes(option) ? 'bg-blue-50' : ''}`}
                onClick={() => handleSelect(option)}
              >
                <label className="flex items-center cursor-pointer">
                  <div className="mr-2 w-5 h-5 flex items-center justify-center border rounded border-gray-300">
                    {internalSelected.includes(option) && (
                      <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
