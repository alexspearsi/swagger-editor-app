import type { User } from '@/types/user';

import { apiClient } from './client';
import { serverFetch } from './server';

export async function getProfile(): Promise<User> {
  return serverFetch<User>('/user/profile');
}

export async function getProfileClient(): Promise<User> {
  const response = await apiClient.get<User>('/user/profile');

  return response.data;
}
