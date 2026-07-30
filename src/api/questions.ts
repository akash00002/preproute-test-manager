import client from "./client";
import type {
  ApiResponse,
  Question,
  CreateQuestionPayload,
} from "../types/api";

export const createQuestionsBulk = (questions: CreateQuestionPayload[]) => {
  return client.post<never, ApiResponse<Question[]>>("/questions/bulk", {
    questions,
  });
};

export const fetchQuestionsBulk = (questionIds: string[]) => {
  return client.post<never, ApiResponse<Question[]>>("/questions/fetchBulk", {
    question_ids: questionIds,
  });
};
