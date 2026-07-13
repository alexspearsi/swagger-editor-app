import { apiClient, ApiError } from '@/app/lib/api/client';
import { getSavedSchema, saveSchema } from '@/app/api/schema';

jest.mock('@/app/lib/api/client', () => ({
  apiClient: { get: jest.fn(), put: jest.fn() },
  ApiError: jest.requireActual('@/app/lib/api/client').ApiError,
}));

describe('getSavedSchema', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the saved schema on success', async () => {
    const saved = { id: '1', content: '{}', createdAt: '', updatedAt: '' };
    (apiClient.get as jest.Mock).mockResolvedValue({ data: saved });

    expect(await getSavedSchema()).toEqual(saved);
    expect(apiClient.get).toHaveBeenCalledWith('/schema');
  });

  it('returns null when the request fails with a 404 ApiError', async () => {
    (apiClient.get as jest.Mock).mockRejectedValue(new ApiError(404, 'Not found'));

    expect(await getSavedSchema()).toBeNull();
  });

  it('returns null for any other unexpected error', async () => {
    (apiClient.get as jest.Mock).mockRejectedValue(new Error('network down'));

    expect(await getSavedSchema()).toBeNull();
  });
});

describe('saveSchema', () => {
  it('puts the content to /schema and returns the saved schema', async () => {
    const saved = { id: '1', content: 'x', createdAt: '', updatedAt: '' };
    (apiClient.put as jest.Mock).mockResolvedValue({ data: saved });

    expect(await saveSchema('x')).toEqual(saved);
    expect(apiClient.put).toHaveBeenCalledWith('/schema', { content: 'x' });
  });
});
