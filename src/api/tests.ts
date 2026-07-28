import client from "./client";
import type { ApiResponse, Test, CreateTestPayload } from "../types/api";

export const getTests = () => {
  return client.get<never, ApiResponse<Test[]>>("/tests");
};

export const getTestById = (id: string) => {
  return client.get<never, ApiResponse<Test>>(`/tests/${id}`);
};

export const createTest = (payload: CreateTestPayload) => {
  return client.post<never, ApiResponse<Test>>("/tests", payload);
};

export const updateTest = (id: string, payload: Partial<CreateTestPayload>) => {
  return client.put<never, ApiResponse<Test>>(`/tests/${id}`, payload);
};
