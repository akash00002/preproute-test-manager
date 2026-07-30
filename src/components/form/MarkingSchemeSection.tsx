import type {
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";
import NumberStepper from "./NumberStepper";

interface MarkingSchemeSectionProps<T extends FieldValues> {
  wrongMarks: number;
  unattemptMarks: number;
  correctMarks: number;
  onWrongChange: (v: number) => void;
  onUnattemptChange: (v: number) => void;
  onCorrectChange: (v: number) => void;
  totalMarks: number;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

export default function MarkingSchemeSection<T extends FieldValues>({
  wrongMarks,
  unattemptMarks,
  correctMarks,
  onWrongChange,
  onUnattemptChange,
  onCorrectChange,
  totalMarks,
  register,
  errors,
}: MarkingSchemeSectionProps<T>) {
  const totalQuestionsError = errors.total_questions?.message as
    | string
    | undefined;

  return (
    <div className="flex flex-col gap-7.5">
      <p className="text-base font-medium text-text-gray leading-[150%]">
        Marking Scheme:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-y-7.5 md:gap-x-12.5">
        {/* Wrong / Unattempted / Correct: gap-[50px] between the three steppers on desktop, wraps on mobile */}
        <div className="flex flex-wrap gap-5 md:gap-12.5">
          <div className="flex flex-col gap-3.75">
            <label className="text-base font-medium text-text-gray leading-[150%]">
              Wrong Answer
            </label>
            <NumberStepper value={wrongMarks} onChange={onWrongChange} />
          </div>
          <div className="flex flex-col gap-3.75">
            <label className="text-base font-medium text-text-gray leading-[150%]">
              Unattempted
            </label>
            <NumberStepper
              value={unattemptMarks}
              onChange={onUnattemptChange}
            />
          </div>
          <div className="flex flex-col gap-3.75">
            <label className="text-base font-medium text-text-gray leading-[150%]">
              Correct Answer
            </label>
            <NumberStepper value={correctMarks} onChange={onCorrectChange} />
          </div>
        </div>

        {/* No of Questions / Total Marks: gap-[50px] between the two on desktop, stacks on mobile */}
        <div className="flex flex-col sm:flex-row gap-5 md:gap-12.5">
          <div className="flex flex-col gap-3.75 flex-1">
            <label className="text-base font-medium text-text-gray leading-[150%]">
              No of Questions
            </label>
            <input
              type="number"
              min={1}
              {...register("total_questions" as Path<T>, {
                valueAsNumber: true,
              })}
              placeholder="Ex: 50 Questions"
              className="no-spinner w-full rounded-[12px] border border-border-medium p-4 text-base text-gray-900 placeholder:text-input-placeholder focus:outline-none focus:border-preproute-primary"
            />
            {totalQuestionsError && (
              <p className="text-red-500 text-xs">{totalQuestionsError}</p>
            )}
          </div>
          <div className="flex flex-col gap-3.75 flex-1">
            <label className="text-base font-medium text-input-placeholder leading-[150%]">
              Total Marks
            </label>
            <input
              value={totalMarks > 0 ? totalMarks : ""}
              placeholder="Ex:250 Marks"
              readOnly
              disabled
              className="w-full rounded-[12px] border border-border-medium p-4 text-base text-input-placeholder placeholder:text-input-placeholder"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
