import { apiClient } from '@/app/lib/api/client';
import { confirmEmail, login, logout, register } from '@/app/lib/api/auth';

jest.mock('@/app/lib/api/client', () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

describe('auth api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('login posts credentials to /auth/login and returns the response data', async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({ data: { message: 'ok' } });

    const result = await login({ email: 'a@b.com', password: 'pw' });

    expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
      email: 'a@b.com',
      password: 'pw',
    });
    expect(result).toEqual({ message: 'ok' });
  });

  it('register posts to /auth/register', async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({ data: { message: 'ok' } });

    await register({ name: 'Alex', email: 'a@b.com', password: 'pw', passwordRepeat: 'pw' });

    expect(apiClient.post).toHaveBeenCalledWith('/auth/register', {
      name: 'Alex',
      email: 'a@b.com',
      password: 'pw',
      passwordRepeat: 'pw',
    });
  });

  it('logout posts to /auth/logout', async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({ data: undefined });

    await logout();

    expect(apiClient.post).toHaveBeenCalledWith('/auth/logout');
  });

  it('confirmEmail posts the token to /auth/email-confirmation', async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({ data: { message: 'ok' } });

    await confirmEmail('tok-123');

    expect(apiClient.post).toHaveBeenCalledWith('/auth/email-confirmation', { token: 'tok-123' });
  });
});
