import { serverFetch } from '@/app/lib/api/server';
import { getHistory } from '@/app/lib/api/history';

jest.mock('@/app/lib/api/server', () => ({
  serverFetch: jest.fn(),
}));

describe('getHistory', () => {
  it('fetches /history via serverFetch and returns the entries', async () => {
    const entries = [{ id: '1', url: '/pets', method: 'GET' }];
    (serverFetch as jest.Mock).mockResolvedValue(entries);

    const result = await getHistory();

    expect(serverFetch).toHaveBeenCalledWith('/history');
    expect(result).toEqual(entries);
  });
});
