import React, { useState, useEffect } from "react";
import { validateField } from "@/helpers/validation";

type SelectProps = {
  name: string;
  value: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onValidate?: (error: string) => void;
  label?: string;
  error?: string;
  rules?: Array<"required">;
  context?: { title?: string };
  options: Array<{ value: string; label: string }>;
  className?: string;
  forceValidate?: boolean;
};

export const Select = ({
  name,
  value,
  disabled,
  onChange,
  onValidate,
  label,
  error,
  rules = [],
  context,
  options,
  className = "",
  forceValidate = false,
}: SelectProps) => {
  const [errorState, setError] = useState(error || "");
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    if (forceValidate && rules.length > 0) {
      const valueToValidate = internalValue || "";
      const errorMsg = validateField(valueToValidate, rules, { title: label });
      setError(errorMsg);
    }
  }, [forceValidate, rules, internalValue, label]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange(e);

    if (rules.length > 0) {
      const errorMsg = validateField(newValue, rules, context);
      setError(errorMsg);
      onValidate?.(errorMsg);
    }
  };

  return (
    <div className={`mb-4 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}>
      {label && (
        <label className="block text-sm font-medium mb-2">
          {label}
          {rules?.includes("required") && (
            <span className="text-red-500">*</span>
          )}
        </label>
      )}
      <select
        name={name}
        value={internalValue}
        onChange={handleChange}
        className={`w-full p-2 border rounded ${errorState ? "border-red-500" : ""} ${className}`}
        disabled={disabled}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errorState && <div className="text-red-500 text-sm">{errorState}</div>}
    </div>
  );
};
