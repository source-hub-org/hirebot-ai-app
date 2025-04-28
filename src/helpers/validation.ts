type ValidationRule =
  | "required"
  | "phone"
  | "email"
  | "number"
  | { min: number }
  | { max: number };

type ValidatorFn = (
  value: string | number,
  ruleValue?: string | number,
  ctx?: ValidationContext,
) => string;

type ValidationContext = {
  title?: string;
  [key: string]: string | number | boolean | undefined;
};

const validators: Record<string, ValidatorFn> = {
  required: (value, _, ctx) => {
    if (!value || !value.toString().trim()) {
      return ctx?.title ? `${ctx.title} là bắt buộc` : "Trường này là bắt buộc";
    }
    return "";
  },
  number: (value, _, ctx) => {
    if (isNaN(Number(value))) {
      return ctx?.title ? `${ctx.title} phải là số` : "Giá trị phải là số";
    }
    return "";
  },
  phone: (value, _, ctx) => {
    if (!/^(0|\+84)[1-9][0-9]{8}$/.test(value.toString())) {
      return ctx?.title
        ? `${ctx.title} không hợp lệ`
        : "Số điện thoại không hợp lệ";
    }
    return "";
  },
  email: (value, _, ctx) => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.toString())) {
      return ctx?.title ? `${ctx.title} không hợp lệ` : "Email không hợp lệ";
    }
    return "";
  },
  min: (value, minValue = 0, ctx) => {
    if (Number(value) < Number(minValue)) {
      return ctx?.title
        ? `${ctx.title} phải lớn hơn hoặc bằng ${minValue}`
        : `Giá trị phải lớn hơn hoặc bằng ${minValue}`;
    }
    return "";
  },
  max: (value, maxValue = Infinity, ctx) => {
    if (Number(value) > Number(maxValue)) {
      return ctx?.title
        ? `${ctx.title} phải nhỏ hơn hoặc bằng ${maxValue}`
        : `Giá trị phải nhỏ hơn hoặc bằng ${maxValue}`;
    }
    return "";
  },
};

export function validateField(
  value: string | number,
  rules: Array<string | { [key: string]: string | number }>,
  context: ValidationContext = {},
): string {
  for (const rule of rules) {
    if (typeof rule === "string") {
      const error = validators[rule](value, undefined, context);
      if (error) return error;
    } else if (typeof rule === "object") {
      for (const [ruleName, ruleValue] of Object.entries(rule)) {
        if (ruleName in validators) {
          const error = validators[ruleName](value, ruleValue, context);
          if (error) return error;
        }
      }
    }
  }
  return "";
}

export const validateAllFields = (
  fields: Record<
    string,
    { value: string | number; rules: ValidationRule[]; name?: string }
  >,
): Record<string, string> => {
  const errors: Record<string, string> = {};

  Object.entries(fields).forEach(([key, { value, rules, name }]) => {
    errors[key] = validateField(String(value), rules, { title: name });
  });

  return errors;
};
