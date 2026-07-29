import axios, { AxiosError } from "axios";
import { useAuthStore } from "../store/authStore";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Read the token at request time so restored sessions and fresh logins both work.
client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => {
    // API helpers expect the backend envelope, not the full Axios response.
    return response.data;
  },
  (error: AxiosError<{ status: string; message: string }>) => {
    if (error.response?.status === 401) {
      // Clear auth once the server says this session is no longer valid.
      useAuthStore.getState().logout();
    }
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject(new Error(message));
  },
);

export default client;
