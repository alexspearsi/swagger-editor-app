import { apiClient, ApiError } from '../lib/api/client';

export interface SavedSchema {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export async function getSavedSchema(): Promise<SavedSchema | null> {
  try {
    const response = await apiClient.get<SavedSchema | null>('/schema');

    return response.data;
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 404)) {
      return null;
    }

    return null;
  }
}

export async function saveSchema(content: string): Promise<SavedSchema> {
  const response = await apiClient.put<SavedSchema>('/schema', { content });

  return response.data;
}
