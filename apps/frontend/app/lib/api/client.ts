import axios, { AxiosError } from 'axios';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status ?? 500;
    const isAuthEndpoint = error.config?.url?.startsWith('/auth/');

    if (status === 401 && !isAuthEndpoint && typeof window !== 'undefined') {
      window.location.href = '/';
    }

    throw new ApiError(status, error.response?.data?.message ?? 'Unknown error');
  },
);
