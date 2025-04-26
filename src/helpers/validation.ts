type ValidationRule = 'required' | 'phone' | 'email' | 'number' | { min: number } | { max: number };

type ValidationResult = {
  isValid: boolean;
  message: string;
};

type ValidatorFn = (value: any, ruleValue: any, ctx?: any) => ValidationResult;

type ValidationContext = {
  title?: string;
  [key: string]: any;
};

const validators: Record<string, ValidatorFn> = {
  required: (value, _, ctx) => ({
    isValid: !!value,
    message: ctx?.title ? `${ctx.title} không được phép trống!` : 'Trường này là bắt buộc'
  }),
  number: (value, _, ctx) => ({
    isValid: !isNaN(Number(value)),
    message: ctx?.title ? `${ctx.title} phải là số` : 'Giá trị phải là số'
  }),
  phone: (value, _, ctx) => ({
    isValid: /^(\+?84|0)(3[2-9]|5[689]|7[06-9]|8[1-9]|9\d)\d{7}$/.test(value),
    message: ctx?.title ? `${ctx.title} không hợp lệ` : 'Số điện thoại không hợp lệ'
  }),
  email: (value, _, ctx) => ({
    isValid: !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: ctx?.title ? `${ctx.title} không hợp lệ` : 'Email không hợp lệ'
  }),
  min: (value, minValue, ctx) => ({
    isValid: Number(value) >= minValue,
    message: ctx?.title 
      ? `${ctx.title} tối thiểu là ${minValue}` 
      : `Giá trị tối thiểu là ${minValue}`
  }),
  max: (value, maxValue, ctx) => ({
    isValid: Number(value) <= maxValue,
    message: ctx?.title 
      ? `${ctx.title} tối đa là ${maxValue}` 
      : `Giá trị tối đa là ${maxValue}`
  })
};

const required = (value: any, fieldName?: string): ValidationResult => ({
  isValid: !!value,
  message: fieldName ? `Vui lòng nhập ${fieldName}` : 'Trường này là bắt buộc'
});

const number = (value: any, fieldName?: string): ValidationResult => ({
  isValid: !isNaN(Number(value)),
  message: fieldName ? `${fieldName} phải là số` : 'Giá trị phải là số'
});

const min = (value: number, minValue: number, fieldName?: string): ValidationResult => ({
  isValid: value >= minValue,
  message: fieldName 
    ? `${fieldName} tối thiểu là ${minValue}` 
    : `Giá trị tối thiểu là ${minValue}`
});

const max = (value: number, maxValue: number, fieldName?: string): ValidationResult => ({
  isValid: value <= maxValue,
  message: fieldName 
    ? `${fieldName} tối đa là ${maxValue}` 
    : `Giá trị tối đa là ${maxValue}`
});

export const validateField = (
  value: string | number,
  rules: ValidationRule[],
  context: ValidationContext = {}
): string => {
  let error = '';

  for (const rule of rules) {
    if (typeof rule === 'string') {
      switch (rule) {
        case 'required':
          if (value && !value.toString().trim()) {
            return context.title ? `${context.title} là bắt buộc` : 'Trường này là bắt buộc';
          }
          break;
        case 'number':
          if (isNaN(Number(value))) {
            return context.title ? `${context.title} phải là số` : 'Giá trị phải là số';
          }
          break;
        case 'phone':
          if (!/^(0|\+84)[1-9][0-9]{8}$/.test(value.toString())) {
            return context.title ? `${context.title} không hợp lệ` : 'Số điện thoại không hợp lệ';
          }
          break;
        case 'email':
          if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.toString())) {
            return context.title ? `${context.title} không hợp lệ` : 'Email không hợp lệ';
          }
          break;
      }
    } else if (typeof rule === 'object') {
      if ('min' in rule && Number(value) < rule.min) {
        return context.title 
          ? `${context.title} phải lớn hơn hoặc bằng ${rule.min}`
          : `Giá trị phải lớn hơn hoặc bằng ${rule.min}`;
      }
      if ('max' in rule && Number(value) > rule.max) {
        return context.title
          ? `${context.title} phải nhỏ hơn hoặc bằng ${rule.max}`
          : `Giá trị phải nhỏ hơn hoặc bằng ${rule.max}`;
      }
    }
  }

  return error;
};

export const validateAllFields = (
  fields: Record<string, { value: string | number; rules: ValidationRule[]; name?: string }>
): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  Object.entries(fields).forEach(([key, { value, rules, name }]) => {
    errors[key] = validateField(String(value), rules, { title: name });
  });
  
  return errors;
};
