import { AxiosError } from 'axios';

import { apiClient, ApiError } from '@/app/lib/api/client';

function makeError(status: number, url: string, message = 'Something failed'): AxiosError {
  return {
    isAxiosError: true,
    name: 'AxiosError',
    message: 'Request failed',
    config: { url },
    response: { status, data: { message } },
  } as unknown as AxiosError;
}

function getRejectedHandler() {
  const handlers = (
    apiClient.interceptors.response as unknown as {
      handlers: Array<{ rejected: (error: AxiosError) => never }>;
    }
  ).handlers;

  return handlers[handlers.length - 1].rejected;
}

describe('apiClient response interceptor', () => {
  it('throws an ApiError with the server message and status', () => {
    const rejected = getRejectedHandler();

    try {
      rejected(makeError(500, '/history', 'Boom'));
      throw new Error('expected rejected() to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).status).toBe(500);
      expect((error as ApiError).message).toBe('Boom');
    }
  });

  it('throws an ApiError for a 401 on a non-auth endpoint', () => {
    const rejected = getRejectedHandler();

    expect(() => rejected(makeError(401, '/user/profile', 'Unauthorized'))).toThrow(ApiError);
  });

  it('throws an ApiError for a 401 on an auth endpoint (e.g. wrong login password)', () => {
    const rejected = getRejectedHandler();

    try {
      rejected(makeError(401, '/auth/login', 'Invalid credentials'));
      throw new Error('expected rejected() to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).message).toBe('Invalid credentials');
    }
  });

  it('falls back to a default status and message when the response is missing', () => {
    const rejected = getRejectedHandler();
    const error = {
      isAxiosError: true,
      name: 'AxiosError',
      message: 'Network Error',
      config: { url: '/history' },
    } as unknown as AxiosError;

    try {
      rejected(error);
      throw new Error('expected rejected() to throw');
    } catch (thrown) {
      expect(thrown).toBeInstanceOf(ApiError);
      expect((thrown as ApiError).status).toBe(500);
      expect((thrown as ApiError).message).toBe('Unknown error');
    }
  });
});
