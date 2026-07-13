import { executeRequest } from '@/app/lib/swagger/proxy';

describe('executeRequest', () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  it('posts the request to /api/proxy and returns the parsed JSON response', async () => {
    const proxyResponse = {
      status: 200,
      statusText: 'OK',
      headers: {},
      body: '{}',
      duration: 10,
      requestSize: 0,
      responseSize: 2,
    };

    fetchMock.mockResolvedValue({
      json: () => Promise.resolve(proxyResponse),
    });

    const result = await executeRequest({ url: 'https://api.example.com/pets', method: 'GET' });

    expect(fetchMock).toHaveBeenCalledWith('/api/proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'https://api.example.com/pets', method: 'GET' }),
    });
    expect(result).toEqual(proxyResponse);
  });
});
