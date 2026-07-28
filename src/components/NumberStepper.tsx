interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
}

export default function NumberStepper({
  value,
  onChange,
  prefix = "",
}: NumberStepperProps) {
  return (
    <div className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 w-full">
      <span className="text-gray-900 font-medium">
        {value > 0 ? "+" : ""}
        {prefix}
        {value}
      </span>
      <div className="flex flex-col">
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="text-gray-400 hover:text-gray-600 text-xs leading-none"
        >
          ▲
        </button>
        <button
          type="button"
          onClick={() => onChange(value - 1)}
          className="text-gray-400 hover:text-gray-600 text-xs leading-none"
        >
          ▼
        </button>
      </div>
    </div>
  );
}
