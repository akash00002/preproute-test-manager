import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
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
import add from "../assets/add.svg";
import download from "../assets/download.svg";
import deleteIcon from "../assets/delete-icon.svg";

const breadcrumbLabels: Record<string, string> = {
  chapterwise: "Chapter Wise",
  pyq: "PYQ",
  mock: "Mock Test",
};

export default function AddQuestionsPage() {
  const navigate = useNavigate();
  const testId = useTestDraftStore((state) => state.testId);
  const testData = useTestDraftStore((state) => state.testData);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);
  const [isPublishView, setIsPublishView] = useState(false);

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
    setIsPublishView(true);
  };

  const handlePublishCancel = () => {
    setIsPublishView(false);
  };

  const handlePublishConfirm = (settings: PublishSettings) => {
    // TODO: wire to actual publish/save API call, passing `settings`
    // (mode, liveUntil, customEndDate, customEndTime) along with testId.
    setIsPublishView(false);
    // e.g. navigate("/test-creation") once the API call succeeds
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

      <div className="p-5 flex flex-col gap-5">
        {isPublishView && (
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-lg font-semibold text-text-gray">
              Test created
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-600">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
                <Check className="w-3 h-3" />
              </span>
              {allDone
                ? `All ${questions.length} Questions done`
                : `${completedCount}/${questions.length} Questions done`}
            </span>
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
          <PublishTestView
            onCancel={handlePublishCancel}
            onConfirm={handlePublishConfirm}
          />
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
                className="w-33.5 h-8 flex items-center bg-error-50 rounded-lg px-1.25 gap-0.5 text-sm font-medium text-error-300 hover:opacity-80 -mt-4"
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
                  className="w-full sm:w-45 h-12 rounded-lg bg-error-300 text-gray-50 font-medium text-base"
                >
                  Exit Test Creation
                </button>
                <button
                  onClick={goNext}
                  className="w-full sm:w-40 h-12 rounded-lg bg-preproute-next text-gray-50 font-medium text-base"
                >
                  Next
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
