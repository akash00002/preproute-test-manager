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
    <div className="flex flex-col gap-[30px]">
      <label className="text-base font-medium text-text-gray leading-[150%]">
        Test Difficulty Level
      </label>

      <div className="flex h-6 w-[510px] items-center justify-between">
        {levels.map((level) => (
          <label
            key={level}
            className="flex cursor-pointer items-center gap-[10px]"
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
