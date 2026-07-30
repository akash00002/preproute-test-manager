import deleteIcon from "../../assets/deleteGray-icon.svg";

interface OptionsEditorProps {
  options: string[];
  correctOptionIndex: number | null;
  onOptionChange: (index: number, value: string) => void;
  onSelectCorrect: (index: number) => void;
}

export default function OptionsEditor({
  options,
  correctOptionIndex,
  onOptionChange,
  onSelectCorrect,
}: OptionsEditorProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-base font-medium text-text-gray">
        Type the options below
      </p>

      {options.map((opt, index) => (
        <div key={index} className="flex items-center gap-3">
          {/* Select Correct Option */}
          <button
            type="button"
            onClick={() => onSelectCorrect(index)}
            aria-pressed={correctOptionIndex === index}
            aria-label={`Mark option ${index + 1} as correct`}
            className={`w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center ${
              correctOptionIndex === index
                ? "border-preproute-next"
                : "border-blue-300"
            }`}
          >
            {correctOptionIndex === index && (
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            )}
          </button>

          {/* Option Input */}
          <div className="relative flex-1">
            <input
              value={opt}
              onChange={(e) => onOptionChange(index, e.target.value)}
              placeholder="Type Option here"
              className="w-full h-12 rounded-lg border border-border bg-white px-5 py-2.5 text-sm text-text-gray placeholder:text-input-border placeholder:font-normal focus:outline-none focus:border-preproute-primary"
            />

            {/* Clear Option */}
            <button
              type="button"
              disabled={!opt}
              onClick={() => onOptionChange(index, "")}
              aria-label={`Clear option ${index + 1}`}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-input-border hover:text-red-500 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <img src={deleteIcon} alt="" className="w-6 h-6" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
