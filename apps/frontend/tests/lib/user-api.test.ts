import { apiClient } from '@/app/lib/api/client';
import { serverFetch } from '@/app/lib/api/server';
import { getProfile, getProfileClient } from '@/app/lib/api/user';

jest.mock('@/app/lib/api/client', () => ({
  apiClient: { get: jest.fn() },
}));

jest.mock('@/app/lib/api/server', () => ({
  serverFetch: jest.fn(),
}));

describe('user api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getProfile fetches /user/profile via serverFetch', async () => {
    (serverFetch as jest.Mock).mockResolvedValue({ id: '1', email: 'a@b.com' });

    const result = await getProfile();

    expect(serverFetch).toHaveBeenCalledWith('/user/profile');
    expect(result).toEqual({ id: '1', email: 'a@b.com' });
  });

  it('getProfileClient fetches /user/profile via apiClient', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({ data: { id: '1', email: 'a@b.com' } });

    const result = await getProfileClient();

    expect(apiClient.get).toHaveBeenCalledWith('/user/profile');
    expect(result).toEqual({ id: '1', email: 'a@b.com' });
  });
});
