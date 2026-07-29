type Difficulty = "easy" | "medium" | "difficult";

interface DifficultySelectorProps {
  value: Difficulty;
  onChange: (value: Difficulty) => void;
}

const levels: Difficulty[] = ["easy", "medium", "difficult"];

export default function DifficultySelector({
  value,
  onChange,
}: DifficultySelectorProps) {
  return (
    <div className="flex flex-col gap-7.5">
      <label className="text-base font-medium text-text-gray leading-[150%]">
        Test Difficulty Level
      </label>

      <div className="flex h-6 w-full max-w-127.5 items-center justify-between flex-wrap gap-y-4">
        {levels.map((level) => (
          <label
            key={level}
            className="flex cursor-pointer items-center gap-2.5"
          >
            <input
              type="radio"
              checked={value === level}
              onChange={() => onChange(level)}
              className="h-5 w-5 accent-preproute-next"
            />

            <span className="text-base font-medium capitalize text-text-gray">
              {level}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
