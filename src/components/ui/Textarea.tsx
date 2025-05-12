import React, { useEffect, useState } from "react";
import { validateField } from "@/helpers/validation";

type TextareaProps = {
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  label?: string;
  placeholder?: string;
  rules?: Array<string | { min: number } | { max: number }>;
  context?: { title?: string };
  className?: string;
  forceValidate?: boolean;
};

export const Textarea = ({
  name,
  value,
  onChange,
  label,
  placeholder,
  rules = [],
  context,
  className = "",
  forceValidate = false,
}: TextareaProps) => {
  const [error, setError] = useState("");

  useEffect(() => {
    if (forceValidate && rules.length > 0) {
      const errorMsg = validateField(value, rules, context);
      setError(errorMsg);
    }
  }, [forceValidate, rules, value, context]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e);

    if (rules.length > 0) {
      const errorMsg = validateField(e.target.value, rules, context);
      setError(errorMsg);
    }
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium mb-2">
          {label}
          {rules?.includes("required") && (
            <span className="text-red-500">*</span>
          )}
        </label>
      )}
      <textarea
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full p-2 border rounded ${error ? "border-red-500" : ""} ${className}`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};
