import { AxiosError } from 'axios';
import { cookies } from 'next/headers';

import { ApiError, apiClient } from './client';

type RequestOptions = {
  method?: 'get' | 'post' | 'patch' | 'delete';
  data?: unknown;
};

export async function serverFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ');

  try {
    const response = await apiClient.request<T>({
      url: path,
      method: options.method ?? 'get',
      data: options.data,
      headers: { Cookie: cookieHeader },
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;

    throw new ApiError(
      axiosError.response?.status ?? 500,
      axiosError.response?.data?.message ?? 'Unknown error',
    );
  }
}
