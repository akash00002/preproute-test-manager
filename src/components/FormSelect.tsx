import { forwardRef, type SelectHTMLAttributes } from "react";
import chevronIcon from "../assets/chevron-icon.svg";

interface Option {
  id: string;
  name: string;
}

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  error?: string;
  loading?: boolean;
  placeholder?: string;
  currentValue?: string; // <- explicit, passed from parent's watch()
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    {
      label,
      options,
      error,
      loading,
      placeholder = "Choose from Drop-down",
      className,
      currentValue,
      ...selectProps
    },
    ref,
  ) => {
    const hasValue = Boolean(currentValue);

    return (
      <div className="flex flex-col gap-[15px]">
        <label className="text-base font-medium text-text-color leading-[150%]">
          {label}
        </label>
        <div className="relative">
          <select
            ref={ref}
            className={
              className ??
              `w-full rounded-[12px] border-[0.5px] border-input-border bg-white p-4 text-base appearance-none transition-colors focus:border-preproute-primary focus:outline-none disabled:cursor-not-allowed ${hasValue ? "text-text-color" : "text-input-placeholder"}`
            }
            {...selectProps}
          >
            <option value="" className="text-input-placeholder">
              {loading ? "Loading..." : placeholder}
            </option>
            {options.map((opt) => (
              <option key={opt.id} value={opt.id} className="text-text-color">
                {opt.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 h-6 w-6 -translate-y-1/2 flex items-center justify-center">
            <img
              src={chevronIcon}
              alt=""
              className="w-[16.5px] h-[9.02px] rotate-180"
            />
          </div>
        </div>
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>
    );
  },
);

FormSelect.displayName = "FormSelect";

export default FormSelect;
