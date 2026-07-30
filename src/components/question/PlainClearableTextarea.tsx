import deleteIcon from "../../assets/deleteGray-icon.svg";

interface PlainClearableTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  clearLabel: string;
  className?: string;
}

export default function PlainClearableTextarea({
  value,
  onChange,
  placeholder = "Type here",
  rows = 4,
  clearLabel,
  className = "",
}: PlainClearableTextareaProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full h-44 px-4 py-3 pr-10 text-text-color bg-white outline-none resize-none  text-sm text-text-gray placeholder:text-input-border placeholder:font-normal"
      />
      <button
        type="button"
        disabled={!value}
        onClick={() => onChange("")}
        aria-label={clearLabel}
        className="absolute top-3 right-3 text-input-border hover:text-red-500 active:scale-90 active:text-red-600 transition-transform duration-100 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <img src={deleteIcon} alt="" className="w-6 h-6" />
      </button>
    </div>
  );
}
