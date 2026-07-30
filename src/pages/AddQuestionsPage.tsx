import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTestDraftStore } from "../store/testDraftStore";
import { useQuestionDraftStore } from "../store/questionDraftStore";
import TestInfoCard from "../components/question/TestInfoCard";
import QuestionEditor from "../components/question/QuestionEditor";
import OptionsEditor from "../components/question/OptionsEditor";
import SolutionEditor from "../components/question/SolutionEditor";
import PaginationControls from "../components/question/PaginationControls";
import QuestionSettingsGrid from "../components/question/QuestionSettingsGrid";
import { useResolvedTestNames } from "../hooks/useResolvedTestNames";
import EditTestModal from "../components/EditTestModal";
import Breadcrumb from "../components/Breadcrumb";
import PublishTestView from "../components/question/PublishTestView";
import type { PublishSettings } from "../components/question/PublishTestView";
import { createQuestionsBulk } from "../api/questions";
import { updateTest } from "../api/tests";
import type { CreateQuestionPayload } from "../types/api";
import type { QuestionDraft } from "../types/question";
import add from "../assets/add.svg";
import download from "../assets/download.svg";
import deleteIcon from "../assets/delete-icon.svg";
import tick from "../assets/tick.svg";

const breadcrumbLabels: Record<string, string> = {
  chapterwise: "Chapter Wise",
  pyq: "PYQ",
  mock: "Mock Test",
};

// Maps an in-progress question draft to the API's bulk-create shape.
// Returns null if the draft isn't actually filled in (e.g. an unused
// pre-allocated slot), so callers can filter those out.
function toCreateQuestionPayload(
  draft: QuestionDraft,
  testId: string,
  subjectId: string,
  topicNameById: Map<string, string>,
  subTopicNameById: Map<string, string>,
): CreateQuestionPayload | null {
  if (!draft.text.trim()) return null;
  if (draft.correctOptionIndex === null) return null;

  const optionKeys = ["option1", "option2", "option3", "option4"] as const;
  const correctOption = optionKeys[draft.correctOptionIndex];
  if (!correctOption) return null;

  // The backend's /questions/bulk expects topic/sub_topic as NAME strings,
  // not IDs — unlike Test.topics (which is IDs). Convert here.
  const topic = draft.topic ? topicNameById.get(draft.topic) : undefined;
  const subTopic = draft.subTopic
    ? subTopicNameById.get(draft.subTopic)
    : undefined;

  return {
    type: "mcq",
    question: draft.text,
    option1: draft.options[0] ?? "",
    option2: draft.options[1] ?? "",
    option3: draft.options[2] ?? "",
    option4: draft.options[3] ?? "",
    correct_option: correctOption,
    explanation: draft.solution || undefined,
    difficulty: draft.difficulty || undefined,
    subject: subjectId,
    topic,
    sub_topic: subTopic,
    test_id: testId,
  };
}

export default function AddQuestionsPage() {
  const navigate = useNavigate();
  const testId = useTestDraftStore((state) => state.testId);
  const testData = useTestDraftStore((state) => state.testData);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);
  const [isPublishView, setIsPublishView] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  const {
    subjectName,
    topics: resolvedTopics,
    subTopics: resolvedSubTopics,
  } = useResolvedTestNames(
    testData?.subject,
    testData?.topics,
    testData?.sub_topics,
  );

  const questions = useQuestionDraftStore((state) => state.questions);
  const currentIndex = useQuestionDraftStore((state) => state.currentIndex);
  const initQuestions = useQuestionDraftStore((state) => state.initQuestions);
  const setCurrentIndex = useQuestionDraftStore(
    (state) => state.setCurrentIndex,
  );
  const updateCurrent = useQuestionDraftStore((state) => state.updateCurrent);
  const updateOption = useQuestionDraftStore((state) => state.updateOption);
  const resetCurrent = useQuestionDraftStore((state) => state.resetCurrent);
  const resetTestDraft = useTestDraftStore((state) => state.reset);
  const resetQuestions = useQuestionDraftStore((state) => state.resetQuestions);

  useEffect(() => {
    if (!testId || !testData) {
      navigate("/tests/create/chapterwise", { replace: true });
    }
  }, [testId, testData, navigate]);

  useEffect(() => {
    const totalQuestions = testData?.total_questions ?? 50;
    if (testId) {
      initQuestions(testId, totalQuestions);
    }
  }, [testId, testData?.total_questions, initQuestions]);

  if (!testId || !testData || questions.length === 0) {
    return null;
  }

  const current = questions[currentIndex];
  const typeLabel = testData?.type
    ? breadcrumbLabels[testData.type]
    : "Chapter Wise";

  const goPrev = () => setCurrentIndex(Math.max(0, currentIndex - 1));
  const goNext = () => {
    updateCurrent({ completed: current.text.trim().length > 0 });
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleDeleteAllEdits = () => {
    resetCurrent();
  };

  const handlePublish = () => {
    setPublishError(null);
    setIsPublishView(true);
  };

  const handlePublishCancel = () => {
    if (isPublishing) return;
    setPublishError(null);
    setIsPublishView(false);
  };

  const handlePublishConfirm = async (settings: PublishSettings) => {
    setPublishError(null);

    if (!testData.subject) {
      setPublishError(
        "This test is missing a subject — go back and set it before publishing.",
      );
      return;
    }

    const validTopicIds = new Map(resolvedTopics.map((t) => [t.id, t.name]));
    const validSubTopicIds = new Map(
      resolvedSubTopics.map((st) => [st.id, st.name]),
    );

    const payloads = questions
      .map((q) =>
        toCreateQuestionPayload(
          q,
          testId,
          testData.subject!,
          validTopicIds,
          validSubTopicIds,
        ),
      )
      .filter((p): p is CreateQuestionPayload => p !== null);
    // ...rest unchanged

    if (payloads.length === 0) {
      setPublishError(
        "Add at least one complete question (with an answer selected) before publishing.",
      );
      return;
    }

    setIsPublishing(true);
    try {
      console.table(
        payloads.map((p) => ({
          question: p.question.slice(0, 20),
          topic: p.topic,
          sub_topic: p.sub_topic,
          subject: p.subject,
        })),
      );

      const bulkRes = await createQuestionsBulk(payloads);
      const createdIds = bulkRes.data.map((q) => q.id);

      // NOTE: scheduling fields (scheduleDate/scheduleTime, liveUntil,
      // custom end date/time) from `settings` aren't in CreateTestPayload
      // per the API doc, so they aren't sent here. If the backend does
      // accept them, extend CreateTestPayload and pass them through below.

      await updateTest(testId, {
        questions: createdIds,
        total_questions: createdIds.length,
        status: settings.mode === "schedule" ? "scheduled" : "live",
      });

      resetTestDraft();
      resetQuestions();
      navigate("/test-creation", { replace: true });
    } catch (err) {
      setPublishError(
        err instanceof Error ? err.message : "Failed to publish test.",
      );
    } finally {
      setIsPublishing(false);
    }
  };

  const handleExitConfirm = () => {
    setIsExitConfirmOpen(false);
    resetTestDraft();
    resetQuestions();
    navigate("/tests/create/chapterwise");
  };

  const completedCount = questions.filter((q) => q.completed).length;
  const allDone = completedCount === questions.length;

  return (
    <div className="flex-1 min-w-0">
      {/* Breadcrumb + Publish — persists in both editor and publish views */}
      {!isPublishView && (
        <Breadcrumb
          items={[
            { label: "Test Creation", to: "/test-creation" },
            { label: "Create Test", to: "/test-creation/create-test" },
            { label: typeLabel },
          ]}
          showActionButton={!isPublishView}
          showBottomBorder
          actionLabel="Publish"
          onActionClick={handlePublish}
        />
      )}
      <div className="p-5 flex flex-col gap-5">
        {isPublishView && (
          <div className="flex flex-col gap-3">
            <p className="text-base font-normal text-black opacity-60 pb-2.5">
              Test Creation
            </p>

            <div className="flex items-center pt-5 gap-5">
              <h1 className="text-base font-bold text-text-gray">
                Test Created
              </h1>

              <span className="inline-flex  h-8 items-center justify-center gap-2.5 rounded-lg border-[0.5px] border-success px-2.5 text-xs font-normal text-emerald-600">
                <span className="flex h-4 w-4 items-center justify-center">
                  <img src={tick} alt="" className="w-4 h-4" />
                </span>

                {allDone
                  ? `All ${questions.length} Questions done`
                  : `${completedCount}/${questions.length} Questions done`}
              </span>
            </div>
          </div>
        )}

        <TestInfoCard
          typeLabel={typeLabel}
          subject={subjectName}
          topics={resolvedTopics.map((t) => t.name)}
          subTopics={resolvedSubTopics.map((st) => st.name)}
          totalTime={testData?.total_time}
          totalMarks={testData?.total_marks}
          questionCount={questions.length}
          difficulty={testData?.difficulty}
          onEdit={() => setIsEditModalOpen(true)}
        />

        {isEditModalOpen && (
          <EditTestModal onClose={() => setIsEditModalOpen(false)} />
        )}

        {isPublishView ? (
          <div className="flex flex-col gap-3">
            {publishError && (
              <p className="text-sm font-medium text-error-300">
                {publishError}
              </p>
            )}
            <PublishTestView
              onCancel={handlePublishCancel}
              onConfirm={handlePublishConfirm}
              isSubmitting={isPublishing}
            />
          </div>
        ) : (
          <>
            {/* Question header */}
            <div className="flex items-center justify-between flex-wrap py-3.5 gap-3">
              <p className="text-base font-medium text-primary-dark">
                Question {currentIndex + 1}
                <span className="text-login-form-border">
                  /{questions.length}
                </span>
              </p>
              <div className="flex gap-3">
                <button className="h-10 px-3 rounded-lg bg-gray-50 text-sm font-medium text-input-border flex items-center gap-1.5">
                  <img src={add} alt="" className="w-5 h-5" />
                  MCQ
                </button>
                <button className="h-10 px-3 rounded-lg text-sm bg-gray-50 font-medium text-input-border flex items-center gap-1.5">
                  <img src={download} alt="" className="w-5 h-5" /> CSV
                </button>
              </div>
            </div>

            <div className="flex flex-col pr- gap-7.5">
              <button
                onClick={handleDeleteAllEdits}
                className="w-33.5 h-8 flex items-center bg-error-50 rounded-lg px-1.25 gap-0.5 text-sm font-medium text-error-300 hover:opacity-80 -mt-4 hover:cursor-pointer"
              >
                <img src={deleteIcon} alt="" className="w-5 h-5" /> Delete All
                Edits
              </button>

              <QuestionEditor
                value={current.text}
                onChange={(text) => updateCurrent({ text })}
              />

              <OptionsEditor
                options={current.options}
                correctOptionIndex={current.correctOptionIndex}
                onOptionChange={updateOption}
                onSelectCorrect={(index) =>
                  updateCurrent({ correctOptionIndex: index })
                }
              />

              <SolutionEditor
                value={current.solution}
                onChange={(solution) => updateCurrent({ solution })}
              />

              <PaginationControls
                currentIndex={currentIndex}
                total={questions.length}
                onPrev={goPrev}
                onNext={goNext}
              />

              <QuestionSettingsGrid
                difficulty={current.difficulty}
                topic={current.topic}
                subTopic={current.subTopic}
                topics={resolvedTopics}
                subTopics={resolvedSubTopics}
                onDifficultyChange={(difficulty) =>
                  updateCurrent({ difficulty })
                }
                onTopicChange={(topic) => updateCurrent({ topic })}
                onSubTopicChange={(subTopic) => updateCurrent({ subTopic })}
              />

              {/* Bottom actions */}
              <div className="flex justify-between items-center gap-4 flex-wrap pb-8">
                <button
                  onClick={() => setIsExitConfirmOpen(true)}
                  className="w-full sm:w-45 h-12 rounded-lg bg-error-300 text-gray-50 font-medium text-base hover:cursor-pointer"
                >
                  Exit Test Creation
                </button>
                <button
                  onClick={
                    currentIndex === questions.length - 1
                      ? handlePublish
                      : goNext
                  }
                  className={`w-full sm:w-40 h-12 rounded-lg text-gray-50 font-medium hover:cursor-pointer text-base ${
                    currentIndex === questions.length - 1
                      ? "bg-preproute-primary"
                      : "bg-preproute-next"
                  }`}
                >
                  {currentIndex === questions.length - 1 ? "Publish" : "Next"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Exit confirmation modal */}
      {isExitConfirmOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-text-gray">
              Exit test creation?
            </h2>
            <p className="mt-2 text-sm text-input-placeholder">
              All unsaved questions and edits for this test will be lost. This
              action can't be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsExitConfirmOpen(false)}
                className="h-10 px-4 rounded-lg border border-input-border text-sm font-medium text-text-gray hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleExitConfirm}
                className="h-10 px-4 rounded-lg bg-red-500 text-sm font-medium text-white hover:opacity-90"
              >
                Exit anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
