import axios, { AxiosError } from "axios";
import { useAuthStore } from "../store/authStore";

const client = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT to every request automatically
client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Unwrap the { status, message, data } envelope, and handle auth errors globally
client.interceptors.response.use(
  (response) => {
    // Return just the `data` field's contents to callers
    return response.data;
  },
  (error: AxiosError<{ status: string; message: string }>) => {
    if (error.response?.status === 401) {
      // Token expired/invalid — force logout
      useAuthStore.getState().logout();
    }
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject(new Error(message));
  },
);

export default client;
