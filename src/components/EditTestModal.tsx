// components/test/EditTestModal.tsx
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { updateTest } from "../api/tests";
import { useTestDraftStore } from "../store/testDraftStore";
import { useTestFormCascade } from "../hooks/useTestFormCascade";
import FormField from "./form/FormField";
import FormSelect from "./form/FormSelect";
import DifficultySelector from "./form/DifficultySelector";
import MarkingSchemeSection from "./form/MarkingSchemeSection";
import TestTypeTabs, {
  isValidTestTab,
  type TestTab,
} from "./form/TestTypeTabs";
import type { CreateTestPayload } from "./../types/api";

const testSchema = z.object({
  name: z.string().min(1, "Test name is required"),
  subject: z.string().min(1, "Subject is required"),
  topics: z.string().min(1, "Topic is required"),
  sub_topics: z.string().optional(),
  total_time: z.coerce.number().min(1, "Duration is required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  total_questions: z.coerce.number().min(1, "Number of questions is required"),
});

type TestFormInput = z.input<typeof testSchema>;
type TestFormOutput = z.output<typeof testSchema>;

interface EditTestModalProps {
  onClose: () => void;
}

export default function EditTestModal({ onClose }: EditTestModalProps) {
  const testId = useTestDraftStore((state) => state.testId);
  const testData = useTestDraftStore((state) => state.testData);
  const setTestData = useTestDraftStore((state) => state.setTestData);

  // The modal has no route param to drive the tab, so seed it from the
  // draft's existing type and keep it as local state instead.
  const [activeTab, setActiveTab] = useState<TestTab>(
    isValidTestTab(testData.type) ? (testData.type as TestTab) : "chapterwise",
  );

  const [wrongMarks, setWrongMarks] = useState(testData.wrong_marks ?? -1);
  const [unattemptMarks, setUnattemptMarks] = useState(
    testData.unattempt_marks ?? 0,
  );
  const [correctMarks, setCorrectMarks] = useState(testData.correct_marks ?? 5);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TestFormInput, unknown, TestFormOutput>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      name: testData.name ?? "",
      subject: testData.subject ?? "",
      topics: testData.topics?.[0] ?? "",
      sub_topics: testData.sub_topics?.[0] ?? "",
      total_time: testData.total_time,
      difficulty:
        (testData.difficulty as TestFormInput["difficulty"]) ?? "easy",
      total_questions: testData.total_questions,
    },
  });

  const selectedSubject = watch("subject");
  const selectedTopic = watch("topics");
  const totalQuestions = watch("total_questions");

  const {
    subjects,
    topics,
    subTopics,
    topicsLoading,
    subTopicsLoading,
    dropdownError,
  } = useTestFormCascade(selectedSubject, selectedTopic, setValue);

  const totalMarks =
    (Number(totalQuestions) || 0) * (Number(correctMarks) || 0);

  const onSubmit = async (values: TestFormOutput) => {
    setSubmitError(null);

    const payload: CreateTestPayload = {
      name: values.name,
      type: activeTab,
      subject: values.subject,
      topics: [values.topics],
      sub_topics: values.sub_topics ? [values.sub_topics] : [],
      correct_marks: correctMarks,
      wrong_marks: wrongMarks,
      unattempt_marks: unattemptMarks,
      difficulty: values.difficulty,
      total_time: values.total_time,
      total_marks: totalMarks,
      total_questions: values.total_questions,
      status: "draft",
    };

    try {
      if (!testId) throw new Error("Missing test id");
      await updateTest(testId, payload);
      setTestData(payload);
      onClose();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to update test",
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-300 max-h-[90vh] overflow-y-auto rounded-card bg-white p-6">
        <div className="flex h-18 items-center justify-between mb-4">
          <p className="text-base font-medium text-black opacity-60 ">
            Edit Test creation
          </p>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-input-border hover:text-text-gray"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-12.5"
        >
          <div className="flex flex-col gap-7.5 space-between">
            <div>
              <TestTypeTabs activeTab={activeTab} onChange={setActiveTab} />

              {dropdownError && (
                <p className="text-red-500 text-sm mt-2">{dropdownError}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-x-12.5 gap-y-7.5 items-st">
              <Controller
                control={control}
                name="subject"
                render={({ field }) => (
                  <FormSelect
                    label="Subject"
                    options={subjects}
                    error={errors.subject?.message}
                    currentValue={field.value}
                    {...field}
                  />
                )}
              />

              <FormField
                label="Name of Test"
                placeholder="Enter name of Test"
                error={errors.name?.message}
                {...register("name")}
              />

              <Controller
                control={control}
                name="topics"
                render={({ field }) => (
                  <FormSelect
                    label="Topic"
                    options={topics}
                    loading={topicsLoading}
                    disabled={!selectedSubject || topicsLoading}
                    error={errors.topics?.message}
                    currentValue={field.value}
                    {...field}
                  />
                )}
              />

              <Controller
                control={control}
                name="sub_topics"
                render={({ field }) => (
                  <FormSelect
                    label="Sub Topic"
                    options={subTopics}
                    loading={subTopicsLoading}
                    disabled={!selectedTopic || subTopicsLoading}
                    error={errors.sub_topics?.message}
                    currentValue={field.value}
                    {...field}
                  />
                )}
              />

              <FormField
                label="Duration (Minutes)"
                placeholder="Enter the time"
                inputMode="numeric"
                error={errors.total_time?.message}
                {...register("total_time")}
              />

              <Controller
                control={control}
                name="difficulty"
                render={({ field }) => (
                  <DifficultySelector
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>

            <MarkingSchemeSection
              wrongMarks={wrongMarks}
              unattemptMarks={unattemptMarks}
              correctMarks={correctMarks}
              onWrongChange={setWrongMarks}
              onUnattemptChange={setUnattemptMarks}
              onCorrectChange={setCorrectMarks}
              totalMarks={totalMarks}
              register={register}
              errors={errors}
            />
          </div>

          <div className="flex justify-end items-center gap-5">
            {submitError && (
              <p className="text-red-500 text-sm mr-auto">{submitError}</p>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-40 h-12 rounded-pill bg-brand-semiWhite text-sidebar-active font-medium text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-40 h-12 rounded-pill bg-preproute-next text-[#FAFAFA] font-medium text-base disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
