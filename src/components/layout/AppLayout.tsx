import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import QuestionSidebar from "../question/QuestionSidebar";
import { useTestDraftStore } from "../../store/testDraftStore";
import { useQuestionDraftStore } from "../../store/questionDraftStore";

export default function AppLayout() {
  const location = useLocation();
  const testId = useTestDraftStore((state) => state.testId);
  const testData = useTestDraftStore((state) => state.testData);

  const isAddQuestionsPage = location.pathname.endsWith("/add-questions");

  const questions = useQuestionDraftStore((state) => state.questions);
  const currentIndex = useQuestionDraftStore((state) => state.currentIndex);
  const isSidebarOpen = useQuestionDraftStore((state) => state.isSidebarOpen);
  const isSidebarCollapsed = useQuestionDraftStore(
    (state) => state.isSidebarCollapsed,
  );
  const setCurrentIndex = useQuestionDraftStore(
    (state) => state.setCurrentIndex,
  );
  const closeSidebar = useQuestionDraftStore((state) => state.closeSidebar);
  const toggleSidebarCollapse = useQuestionDraftStore(
    (state) => state.toggleSidebarCollapse,
  );
  const initQuestions = useQuestionDraftStore((state) => state.initQuestions);

  // Re-seed whenever the test changes
  useEffect(() => {
    if (isAddQuestionsPage && testData) {
      initQuestions(testData.total_questions ?? 50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testId]);

  const sidebar = isAddQuestionsPage ? (
    <QuestionSidebar
      questions={questions}
      currentIndex={currentIndex}
      isOpen={isSidebarOpen}
      isCollapsed={isSidebarCollapsed}
      onSelect={(index) => {
        setCurrentIndex(index);
        closeSidebar();
      }}
      onClose={closeSidebar}
      onToggleCollapse={toggleSidebarCollapse}
    />
  ) : (
    <Sidebar />
  );

  return (
    <div className="h-screen w-full flex overflow-hidden bg-white">
      {sidebar}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-white">
          <div
            className={
              isAddQuestionsPage ? "w-full h-full" : "mx-auto w-full max-w-300"
            }
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
