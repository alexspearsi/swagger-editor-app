/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';

import { POST } from '@/app/api/proxy/route';
import { serverFetch } from '@/app/lib/api/server';

jest.mock('@/app/lib/api/server', () => ({
  serverFetch: jest.fn(),
}));

function jsonRequest(body: unknown): NextRequest {
  return new NextRequest('https://example.com/api/proxy', {
    method: 'POST',
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('POST /api/proxy', () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    (serverFetch as jest.Mock).mockResolvedValue(undefined);
    fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  it('returns 400 for an invalid JSON body', async () => {
    const response = await POST(jsonRequest('not json'));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Invalid JSON body' });
  });

  it('returns 400 when url or method is missing', async () => {
    const response = await POST(jsonRequest({ url: '', method: '' }));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'url and method are required' });
  });

  it('proxies a successful request and logs history', async () => {
    fetchMock.mockResolvedValue({
      status: 200,
      statusText: 'OK',
      headers: {
        forEach: (cb: (v: string, k: string) => void) => cb('application/json', 'content-type'),
      },
      text: () => Promise.resolve('{"ok":true}'),
    });

    const response = await POST(
      jsonRequest({ url: 'https://api.example.com/pets', method: 'get' }),
    );
    const json = await response.json();

    expect(fetchMock).toHaveBeenCalledWith('https://api.example.com/pets', {
      method: 'GET',
      headers: {},
      body: undefined,
    });
    expect(json.status).toBe(200);
    expect(json.body).toBe('{"ok":true}');
    expect(json.headers).toEqual({ 'content-type': 'application/json' });

    expect(serverFetch).toHaveBeenCalledWith(
      '/history',
      expect.objectContaining({
        method: 'post',
        data: expect.objectContaining({
          url: 'https://api.example.com/pets',
          method: 'get',
          statusCode: 200,
        }),
      }),
    );
  });

  it('returns a network-error style response when the fetch throws', async () => {
    fetchMock.mockRejectedValue(new Error('DNS lookup failed'));

    const response = await POST(
      jsonRequest({ url: 'https://api.example.com/pets', method: 'get' }),
    );
    const json = await response.json();

    expect(json.status).toBe(0);
    expect(json.statusText).toBe('Network Error');
    expect(json.error).toBe('DNS lookup failed');

    expect(serverFetch).toHaveBeenCalledWith(
      '/history',
      expect.objectContaining({
        data: expect.objectContaining({ statusCode: null, errorDetails: 'DNS lookup failed' }),
      }),
    );
  });

  it('does not fail the request when logging history throws', async () => {
    (serverFetch as jest.Mock).mockRejectedValue(new Error('history service down'));
    fetchMock.mockResolvedValue({
      status: 200,
      statusText: 'OK',
      headers: { forEach: () => {} },
      text: () => Promise.resolve(''),
    });

    const response = await POST(
      jsonRequest({ url: 'https://api.example.com/pets', method: 'get' }),
    );

    expect(response.status).toBe(200);
  });
});
