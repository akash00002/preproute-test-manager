import { forwardRef, type InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, className, ...inputProps }, ref) => {
    return (
      <div className="flex w-full flex-col 3.75">
        <label className="text-base font-medium text-text-gray leading-[150%]">
          {label}
        </label>
        <input
          ref={ref}
          className={
            className ??
            "w-full rounded-[12px] border-[0.5px] border-input-border bg-white p-4 text-base font-normal text-text-color placeholder:text-input-placeholder transition-colors focus:border-preproute-primary focus:outline-none disabled:bg-[#F9FAFB] disabled:text-input-placeholder"
          }
          {...inputProps}
        />
        {error && (
          <p className="mt-1 text-xs font-medium text-red-500">{error}</p>
        )}
      </div>
    );
  },
);

FormField.displayName = "FormField";

export default FormField;
