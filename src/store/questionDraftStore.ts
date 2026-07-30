import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createEmptyQuestion, type QuestionDraft } from "../types/question";

interface QuestionDraftState {
  questions: QuestionDraft[];
  currentIndex: number;
  seededForTestId: string | null;
  isSidebarOpen: boolean;
  isSidebarCollapsed: boolean;

  initQuestions: (testId: string, totalQuestions: number) => void;
  setCurrentIndex: (index: number) => void;
  updateCurrent: (patch: Partial<QuestionDraft>) => void;
  updateOption: (index: number, value: string) => void;
  resetCurrent: () => void;
  resetQuestions: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebarCollapse: () => void;
}

export const useQuestionDraftStore = create<QuestionDraftState>()(
  persist(
    (set, get) => ({
      questions: [],
      currentIndex: 0,
      seededForTestId: null,
      isSidebarOpen: false,
      isSidebarCollapsed: false,

      initQuestions: (testId, totalQuestions) =>
        set((state) => {
          // Different test than what's currently seeded (including the
          // very first seed, where seededForTestId is null) — start fresh.
          if (state.seededForTestId !== testId) {
            return {
              questions: Array.from({ length: totalQuestions }, (_, i) =>
                createEmptyQuestion(`q-${i + 1}`),
              ),
              currentIndex: 0,
              seededForTestId: testId,
            };
          }

          // Same test, but the question count changed (e.g. user went back
          // and edited total_questions on the form). Resize in place
          // instead of wiping — keep existing drafts, trim extras, or pad
          // with empty questions for the new slots.
          if (state.questions.length !== totalQuestions) {
            const current = state.questions;
            const nextQuestions =
              totalQuestions < current.length
                ? current.slice(0, totalQuestions)
                : [
                    ...current,
                    ...Array.from(
                      { length: totalQuestions - current.length },
                      (_, i) =>
                        createEmptyQuestion(`q-${current.length + i + 1}`),
                    ),
                  ];

            return {
              questions: nextQuestions,
              currentIndex: Math.min(state.currentIndex, totalQuestions - 1),
            };
          }

          // Same test, same count — untouched refresh, keep as-is.
          return state;
        }),

      setCurrentIndex: (index) =>
        set({
          currentIndex: index,
        }),

      updateCurrent: (patch) =>
        set((state) => ({
          questions: state.questions.map((q, i) =>
            i === state.currentIndex ? { ...q, ...patch } : q,
          ),
        })),

      updateOption: (index, value) => {
        const { questions, currentIndex } = get();

        if (!questions[currentIndex]) return;

        const nextOptions = [...questions[currentIndex].options];
        nextOptions[index] = value;

        get().updateCurrent({
          options: nextOptions,
        });
      },

      resetCurrent: () => {
        const { questions, currentIndex } = get();

        if (!questions[currentIndex]) return;

        get().updateCurrent(createEmptyQuestion(questions[currentIndex].id));
      },

      // Fully clears all question drafts (not just the current one) and
      // sidebar UI state. Use this when leaving the question-creation flow
      // entirely (e.g. "Exit Test Creation", Cancel on the test form, or
      // after a successful publish), so the next test starts from a clean
      // slate. seededForTestId is the source of truth for initQuestions —
      // this is a backstop for paths that forget to call it, not a
      // replacement.
      resetQuestions: () =>
        set({
          questions: [],
          currentIndex: 0,
          seededForTestId: null,
          isSidebarOpen: false,
          isSidebarCollapsed: false,
        }),

      openSidebar: () =>
        set({
          isSidebarOpen: true,
        }),

      closeSidebar: () =>
        set({
          isSidebarOpen: false,
        }),

      toggleSidebarCollapse: () =>
        set((state) => ({
          isSidebarCollapsed: !state.isSidebarCollapsed,
        })),
    }),
    {
      name: "question-draft-storage",
    },
  ),
);
