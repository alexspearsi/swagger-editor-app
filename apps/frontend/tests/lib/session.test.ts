import { getProfile } from '@/app/lib/api/user';
import { getSession } from '@/app/lib/api/session';

jest.mock('@/app/lib/api/user', () => ({
  getProfile: jest.fn(),
}));

describe('getSession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the user when getProfile succeeds', async () => {
    (getProfile as jest.Mock).mockResolvedValue({ id: '1', email: 'a@b.com' });

    expect(await getSession()).toEqual({ id: '1', email: 'a@b.com' });
  });

  it('returns null when getProfile throws (unauthenticated)', async () => {
    (getProfile as jest.Mock).mockRejectedValue(new Error('401'));

    expect(await getSession()).toBeNull();
  });
});
