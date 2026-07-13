import { cookies } from 'next/headers';

import { apiClient, ApiError } from '@/app/lib/api/client';
import { serverFetch } from '@/app/lib/api/server';

jest.mock('@/app/lib/api/client', () => ({
  apiClient: { request: jest.fn() },
  ApiError: jest.requireActual('@/app/lib/api/client').ApiError,
}));

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

describe('serverFetch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (cookies as jest.Mock).mockResolvedValue({
      getAll: () => [
        { name: 'access_token', value: 'tok' },
        { name: 'theme', value: 'dark' },
      ],
    });
  });

  it('forwards the request cookies as a Cookie header and returns the response data', async () => {
    (apiClient.request as jest.Mock).mockResolvedValue({ data: { id: '1' } });

    const result = await serverFetch('/history');

    expect(apiClient.request).toHaveBeenCalledWith({
      url: '/history',
      method: 'get',
      data: undefined,
      headers: { Cookie: 'access_token=tok; theme=dark' },
    });
    expect(result).toEqual({ id: '1' });
  });

  it('uses the provided method and data', async () => {
    (apiClient.request as jest.Mock).mockResolvedValue({ data: { ok: true } });

    await serverFetch('/schema', { method: 'post', data: { content: 'x' } });

    expect(apiClient.request).toHaveBeenCalledWith(
      expect.objectContaining({ url: '/schema', method: 'post', data: { content: 'x' } }),
    );
  });

  it('wraps a failed request into an ApiError', async () => {
    (apiClient.request as jest.Mock).mockRejectedValue({
      response: { status: 401, data: { message: 'Unauthorized' } },
    });

    await expect(serverFetch('/user/profile')).rejects.toEqual(new ApiError(401, 'Unauthorized'));
  });

  it('defaults to status 500 and a generic message when the error has no response', async () => {
    (apiClient.request as jest.Mock).mockRejectedValue({});

    await expect(serverFetch('/user/profile')).rejects.toEqual(new ApiError(500, 'Unknown error'));
  });
});
