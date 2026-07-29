import { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createTest } from "../api/tests";
import { useTestDraftStore } from "../store/testDraftStore";
import { useTestFormCascade } from "../hooks/UseTestFormCascade";
import FormField from "../components/FormField";
import FormSelect from "../components/FormSelect";
import DifficultySelector from "../components/DifficultySelector";
import MarkingSchemeSection from "../components/MarkingSchemeSection";

type TestTab = "chapterwise" | "pyq" | "mock";

const testSchema = z.object({
  name: z.string().min(1, "Test name is required"),
  subject: z.string().min(1, "Subject is required"),
  topics: z.string().min(1, "Topic is required"),
  sub_topics: z.string().optional(),
  total_time: z.coerce.number().min(1, "Duration is required"),
  difficulty: z.enum(["easy", "medium", "difficult"]),
  total_questions: z.coerce.number().min(1, "Number of questions is required"),
});

type TestFormInput = z.input<typeof testSchema>;
type TestFormOutput = z.output<typeof testSchema>;

const tabs: { key: TestTab; label: string }[] = [
  { key: "chapterwise", label: "Chapterwise" },
  { key: "pyq", label: "PYQ" },
  { key: "mock", label: "Mock Test" },
];

const breadcrumbLabels: Record<TestTab, string> = {
  chapterwise: "Chapter Wise",
  pyq: "PYQ",
  mock: "Mock Test",
};

const isValidTab = (value: string | undefined): value is TestTab =>
  tabs.some((tab) => tab.key === value);

export default function TestFormPage() {
  const navigate = useNavigate();
  const setTestData = useTestDraftStore((state) => state.setTestData);
  const setTestId = useTestDraftStore((state) => state.setTestId);

  const { type } = useParams<{ type: string }>();
  const activeTab: TestTab = isValidTab(type) ? type : "chapterwise";

  const [wrongMarks, setWrongMarks] = useState(-1);
  const [unattemptMarks, setUnattemptMarks] = useState(0);
  const [correctMarks, setCorrectMarks] = useState(5);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!isValidTab(type)) {
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
    defaultValues: { difficulty: "easy" },
  });

  const selectedSubject = watch("subject");
  const selectedTopic = watch("topics");
  const selectedSubTopic = watch("sub_topics");
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

    const payload = {
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
      status: null,
    };

    try {
      const response = await createTest(payload);
      setTestId(response.data.id);
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

      <div className="w-300 p-5">
        <div className="w-176.25 text-base font-medium text-black/60 leading-[150%] flex items-center">
          <Link
            to="/test-creation"
            className="hover:text-black hover:underline transition-colors"
          >
            Test Creation
          </Link>

          <span className="mx-2">/</span>

          <Link
            to="/test-creation/create-test"
            className="hover:text-black hover:underline transition-colors"
          >
            Create Test
          </Link>

          <span className="mx-2">/</span>

          <Link
            to={`/test-creation/create-test/${activeTab}`}
            className="hover:underline transition-colors ml-2"
          >
            {activeTabLabel}
          </Link>
        </div>
      </div>

      <div className="p-5">
        {/* Main form card: 1152 wide, radius-card, gap-[50px] between sections */}
        <div className="w-full rounded-card bg-white">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-12.5"
          >
            <div className="flex flex-col gap-7.5 space-between">
              {/* Tabs row */}
              <div>
                <div className="w-82.5 h-12.5 px-2.5 py-0.5 flex items-center gap-7.5 border-[0.5px] border-input-placeholder rounded-xl">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() =>
                        navigate(`/tests/create/${tab.key}`, { replace: true })
                      }
                      className={`h-10 px-2.75 py-0.75 gap-1.5 rounded-pill text-sm font-medium transition ${
                        activeTab === tab.key
                          ? "bg-brand-semiWhite text-sidebar-active"
                          : "text-input-border"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {dropdownError && (
                  <p className="text-red-500 text-sm">{dropdownError}</p>
                )}
              </div>

              <div>
                <div className="grid grid-cols-2 gap-x-12.5 gap-y-7.5 items-st">
                  <FormSelect
                    label="Subject"
                    options={subjects}
                    error={errors.subject?.message}
                    currentValue={selectedSubject}
                    {...register("subject")}
                  />

                  <FormField
                    label="Name of Test"
                    placeholder="Enter name of Test"
                    error={errors.name?.message}
                    {...register("name")}
                  />

                  <FormSelect
                    label="Topic"
                    options={topics}
                    loading={topicsLoading}
                    disabled={!selectedSubject || topicsLoading}
                    error={errors.topics?.message}
                    currentValue={selectedTopic}
                    {...register("topics")}
                  />

                  <FormSelect
                    label="Sub Topic"
                    options={subTopics}
                    loading={subTopicsLoading}
                    disabled={!selectedTopic || subTopicsLoading}
                    error={errors.sub_topics?.message}
                    currentValue={selectedSubTopic}
                    {...register("sub_topics")}
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

            {/* Action buttons: 160x48 each, gap-[20px] */}
            <div className="flex justify-end items-center gap-5">
              {submitError && (
                <p className="text-red-500 text-sm mr-auto">{submitError}</p>
              )}
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="w-40 h-12 rounded-pill bg-brand-semiWhite text-sidebar-active font-medium text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-40 h-12 rounded-pill bg-preproute-next text-[#FAFAFA] font-medium text-base disabled:opacity-50"
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
