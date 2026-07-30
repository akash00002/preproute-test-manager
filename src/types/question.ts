export interface QuestionDraft {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number | null;
  solution: string;
  completed: boolean;
  difficulty: string;
  topic: string;
  subTopic: string;
}

export const OPTION_COUNT = 4;

export function createEmptyQuestion(id: string): QuestionDraft {
  return {
    id,
    text: "",
    options: Array(OPTION_COUNT).fill(""),
    correctOptionIndex: null,
    solution: "",
    completed: false,
    difficulty: "",
    topic: "",
    subTopic: "",
  };
}
