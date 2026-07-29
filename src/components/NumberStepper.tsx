import chevronIcon from "../assets/chevron-icon.svg";

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
    <div className="flex items-center justify-between border border-gray-200 rounded-lg p-4 w-37.5 gap-2">
      <span className="text-text-color font-medium">
        {value > 0 ? "+" : ""}
        {prefix}
        {value}
      </span>
      <div className="w-6 h-6 flex flex-col items-center justify-center gap-1.5">
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="flex items-center justify-center hover:opacity-70 hover:cursor-pointer"
          aria-label="Increase"
        >
          <img src={chevronIcon} alt="" className="w-[13.75px] h-[7.52px]" />
        </button>
        <button
          type="button"
          onClick={() => onChange(value - 1)}
          className="flex items-center justify-center hover:opacity-70 hover:cursor-pointer"
          aria-label="Decrease"
        >
          <img
            src={chevronIcon}
            alt=""
            className="w-[13.75px] h-[7.52px] rotate-180"
          />
        </button>
      </div>
    </div>
  );
}
