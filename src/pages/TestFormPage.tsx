/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createTest, updateTest } from "../api/tests";
import { useTestDraftStore } from "../store/testDraftStore";
import { useTestFormCascade } from "../hooks/UseTestFormCascade";
import FormField from "../components/form/FormField";
import FormSelect from "../components/form/FormSelect";
import DifficultySelector from "../components/form/DifficultySelector";
import MarkingSchemeSection from "../components/form/MarkingSchemeSection";
import TestTypeTabs, {
  isValidTestTab,
  type TestTab,
} from "../components/form/TestTypeTabs";
import type { CreateTestPayload } from "../types/api";
import Breadcrumb from "../components/Breadcrumb";
import { useQuestionDraftStore } from "../store/questionDraftStore";

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

const breadcrumbLabels: Record<TestTab, string> = {
  chapterwise: "Chapter Wise",
  pyq: "PYQ",
  mock: "Mock Test",
};

export default function TestFormPage() {
  const navigate = useNavigate();
  const testId = useTestDraftStore((state) => state.testId);
  const testData = useTestDraftStore((state) => state.testData);
  const setTestData = useTestDraftStore((state) => state.setTestData);
  const setTestId = useTestDraftStore((state) => state.setTestId);
  const resetTestDraft = useTestDraftStore((state) => state.reset);
  const resetQuestions = useQuestionDraftStore((state) => state.resetQuestions);

  const { type } = useParams<{ type: string }>();
  const activeTab: TestTab = isValidTestTab(type) ? type : "chapterwise";

  // Seed marking scheme from the existing draft when editing, otherwise
  // fall back to the original defaults for a brand-new test.
  const [wrongMarks, setWrongMarks] = useState(testData.wrong_marks ?? -1);
  const [unattemptMarks, setUnattemptMarks] = useState(
    testData.unattempt_marks ?? 0,
  );
  const [correctMarks, setCorrectMarks] = useState(testData.correct_marks ?? 5);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!isValidTestTab(type)) {
      navigate("/tests/create/chapterwise", { replace: true });
    }
  }, [type, navigate]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TestFormInput, unknown, TestFormOutput>({
    resolver: zodResolver(testSchema),
    // Pre-fill from the draft when returning to edit an existing test;
    // testData is {} for a brand-new test, so these all fall back cleanly.
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
  // const selectedSubTopic = watch("sub_topics");
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

  const activeTabLabel = breadcrumbLabels[activeTab] ?? "Chapter Wise";

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
      // Editing an existing draft updates it in place instead of creating
      // a duplicate test.
      if (testId) {
        await updateTest(testId, payload);
        setTestId(testId);
      } else {
        const response = await createTest(payload);
        setTestId(response.data.id);
      }
      setTestData(payload);
      navigate("/tests/add-questions");
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to create test",
      );
    }
  };

  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            label: "Test Creation",
            to: "/test-creation",
          },
          {
            label: "Create Test",
            to: `/test-creation/create-test/${testData.type}`,
          },
          {
            label: `${activeTabLabel}`,
          },
        ]}
      />

      <div className="p-5">
        <div className="w-full rounded-card bg-white">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-12.5"
          >
            <div className="flex flex-col gap-7.5 space-between">
              <div>
                <TestTypeTabs
                  activeTab={activeTab}
                  onChange={(tab) =>
                    navigate(`/tests/create/${tab}`, { replace: true })
                  }
                />

                {dropdownError && (
                  <p className="text-red-500 text-sm mt-2">{dropdownError}</p>
                )}
              </div>

              <div>
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
                onClick={() => {
                  resetTestDraft();
                  resetQuestions();
                  navigate("/dashboard");
                }}
                className="w-40 h-12 rounded-pill bg-brand-semiWhite text-sidebar-active font-medium text-base hover:cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-40 h-12 rounded-pill bg-preproute-next text-[#FAFAFA] hover:cursor-pointer font-medium text-base disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Next"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
