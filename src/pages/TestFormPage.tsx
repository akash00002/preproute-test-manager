import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  getSubjects,
  getTopicsBySubject,
  getSubTopicsByTopic,
} from "../api/subjects";
import { createTest } from "../api/tests";
import { useTestDraftStore } from "../store/testDraftStore";
import NumberStepper from "../components/NumberStepper";
import type { Subject, Topic, SubTopic } from "../types/api";

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

type TestFormInput = z.input<typeof testSchema>; // before coercion (total_time: string, etc.)
type TestFormOutput = z.output<typeof testSchema>; // after coercion (total_time: number, etc.)

const tabs: { key: TestTab; label: string }[] = [
  { key: "chapterwise", label: "Chapterwise" },
  { key: "pyq", label: "PYQ" },
  { key: "mock", label: "Mock Test" },
];

export default function TestFormPage() {
  const navigate = useNavigate();
  const setTestData = useTestDraftStore((state) => state.setTestData);
  const setTestId = useTestDraftStore((state) => state.setTestId);

  const [activeTab, setActiveTab] = useState<TestTab>("chapterwise");

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subTopics, setSubTopics] = useState<SubTopic[]>([]);

  const [topicsLoading, setTopicsLoading] = useState(false);
  const [subTopicsLoading, setSubTopicsLoading] = useState(false);
  const [dropdownError, setDropdownError] = useState<string | null>(null);

  const [wrongMarks, setWrongMarks] = useState(-1);
  const [unattemptMarks, setUnattemptMarks] = useState(0);
  const [correctMarks, setCorrectMarks] = useState(5);

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
    defaultValues: { difficulty: "easy" },
  });

  const selectedSubject = watch("subject");
  const selectedTopic = watch("topics");
  const totalQuestions = watch("total_questions");

  // Total marks is derived, not user-entered.
  const totalMarks =
    (Number(totalQuestions) || 0) * (Number(correctMarks) || 0);

  useEffect(() => {
    getSubjects()
      .then((res) => setSubjects(res.data))
      .catch(() => setDropdownError("Failed to load subjects"));
  }, []);

  // When subject changes, clear any stale topic/sub-topic selection
  // that belonged to the previous subject.
  useEffect(() => {
    setValue("topics", "");
    setValue("sub_topics", "");
    setTopics([]);
    setSubTopics([]);

    if (!selectedSubject) return;

    setTopicsLoading(true);
    getTopicsBySubject(selectedSubject)
      .then((res) => setTopics(res.data))
      .catch(() => setDropdownError("Failed to load topics"))
      .finally(() => setTopicsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSubject]);

  // When topic changes, clear any stale sub-topic selection.
  useEffect(() => {
    setValue("sub_topics", "");
    setSubTopics([]);

    if (!selectedTopic) return;

    setSubTopicsLoading(true);
    getSubTopicsByTopic(selectedTopic)
      .then((res) => setSubTopics(res.data))
      .catch(() => setDropdownError("Failed to load sub-topics"))
      .finally(() => setSubTopicsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTopic]);

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
    <div>
      {/* Breadcrumb */}
      <p className="text-sm text-gray-500 mb-6">
        Test Creation <span className="mx-1">/</span> Create Test{" "}
        <span className="mx-1">/</span>{" "}
        <span className="text-gray-900">Chapter Wise</span>
      </p>

      {/* Tabs */}
      <div className="inline-flex bg-gray-50 rounded-lg p-1 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded-md text-sm font-medium transition ${
              activeTab === tab.key
                ? "bg-white text-preproute-primary shadow-sm"
                : "text-gray-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {dropdownError && (
        <p className="text-red-500 text-sm mb-4">{dropdownError}</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-x-12 gap-y-6">
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Subject
            </label>
            <select
              {...register("subject")}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-500 focus:outline-none focus:border-preproute-primary"
            >
              <option value="">Choose from Drop-down</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            {errors.subject && (
              <p className="text-red-500 text-xs mt-1">
                {errors.subject.message}
              </p>
            )}
          </div>

          {/* Name of Test */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Name of Test
            </label>
            <input
              {...register("name")}
              placeholder="Enter name of Test"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 placeholder-gray-400 focus:outline-none focus:border-preproute-primary"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Topic */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Topic
            </label>
            <select
              {...register("topics")}
              disabled={!selectedSubject || topicsLoading}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-500 focus:outline-none focus:border-preproute-primary disabled:bg-gray-50"
            >
              <option value="">
                {topicsLoading ? "Loading..." : "Choose from Drop-down"}
              </option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            {errors.topics && (
              <p className="text-red-500 text-xs mt-1">
                {errors.topics.message}
              </p>
            )}
          </div>

          {/* Sub Topic */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Sub Topic
            </label>
            <select
              {...register("sub_topics")}
              disabled={!selectedTopic || subTopicsLoading}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-500 focus:outline-none focus:border-preproute-primary disabled:bg-gray-50"
            >
              <option value="">
                {subTopicsLoading ? "Loading..." : "Choose from Drop-down"}
              </option>
              {subTopics.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name}
                </option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Duration (Minutes)
            </label>
            <input
              {...register("total_time")}
              placeholder="Enter the time"
              inputMode="numeric"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 placeholder-gray-400 focus:outline-none focus:border-preproute-primary"
            />
            {errors.total_time && (
              <p className="text-red-500 text-xs mt-1">
                {errors.total_time.message}
              </p>
            )}
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Test Difficulty Level
            </label>
            <Controller
              control={control}
              name="difficulty"
              render={({ field }) => (
                <div className="flex items-center gap-8 h-12">
                  {(["easy", "medium", "difficult"] as const).map((level) => (
                    <label
                      key={level}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        checked={field.value === level}
                        onChange={() => field.onChange(level)}
                        className="w-4 h-4 accent-preproute-primary"
                      />
                      <span className="text-gray-900 capitalize">{level}</span>
                    </label>
                  ))}
                </div>
              )}
            />
          </div>
        </div>

        {/* Marking Scheme */}
        <div className="mt-8">
          <p className="font-medium text-gray-900 mb-4">Marking Scheme:</p>
          <div className="grid grid-cols-2 gap-x-12 gap-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Wrong Answer
                </label>
                <NumberStepper value={wrongMarks} onChange={setWrongMarks} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Unattempted
                </label>
                <NumberStepper
                  value={unattemptMarks}
                  onChange={setUnattemptMarks}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Correct Answer
                </label>
                <NumberStepper
                  value={correctMarks}
                  onChange={setCorrectMarks}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  No of Questions
                </label>
                <input
                  {...register("total_questions")}
                  placeholder="Ex: 250"
                  inputMode="numeric"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 placeholder-gray-400 focus:outline-none focus:border-preproute-primary"
                />
                {errors.total_questions && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.total_questions.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Total Marks
                </label>
                <input
                  value={totalMarks}
                  readOnly
                  disabled
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 placeholder-gray-400 bg-gray-50 text-gray-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end items-center gap-4 mt-10">
          {submitError && <p className="text-red-500 text-sm">{submitError}</p>}
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="px-8 py-3 rounded-lg bg-indigo-50 text-preproute-primary font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 rounded-lg bg-preproute-primary text-white font-medium disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Next"}
          </button>
        </div>
      </form>
    </div>
  );
}
