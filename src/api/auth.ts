import client from "./client";
import type { ApiResponse, LoginResponse } from "../types/api";

export const login = (userId: string, password: string) => {
  return client.post<never, ApiResponse<LoginResponse>>("/auth/login", {
    userId,
    password,
  });
};
