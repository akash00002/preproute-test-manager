import { create } from "zustand";
import type { CreateTestPayload, Question } from "../types/api";

interface TestDraftState {
  testId: string | null;
  testData: Partial<CreateTestPayload>;
  questions: Question[];
  setTestData: (data: Partial<CreateTestPayload>) => void;
  setTestId: (id: string) => void;
  addQuestion: (q: Question) => void;
  removeQuestion: (index: number) => void;
  reset: () => void;
}

export const useTestDraftStore = create<TestDraftState>((set) => ({
  testId: null,
  testData: {},
  questions: [],
  setTestData: (data) =>
    set((state) => ({ testData: { ...state.testData, ...data } })),
  setTestId: (id) => set({ testId: id }),
  addQuestion: (q) => set((state) => ({ questions: [...state.questions, q] })),
  removeQuestion: (index) =>
    set((state) => ({
      questions: state.questions.filter((_, i) => i !== index),
    })),
  reset: () => set({ testId: null, testData: {}, questions: [] }),
}));
