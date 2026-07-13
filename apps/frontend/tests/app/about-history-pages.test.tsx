import { render, screen } from '@testing-library/react';

import AboutPage from '@/app/about/page';
import HistoryPage from '@/app/history/page';
import { getHistory } from '@/app/lib/api/history';
import { ApiError } from '@/app/lib/api/client';

jest.mock('@/app/lib/api/history', () => ({
  getHistory: jest.fn(),
}));

jest.mock('@/components/history/HistoryCard', () => ({
  HistoryCard: ({ entry }: { entry: { id: string; url: string } }) => <div>entry: {entry.url}</div>,
}));

describe('AboutPage', () => {
  it('renders the title, team member and tech stack', async () => {
    render(await AboutPage());

    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Alexander Strelchenko')).toBeInTheDocument();
    expect(screen.getByText('Next.js 16 (App Router)')).toBeInTheDocument();
    expect(screen.getByText('NestJS')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'RS School' }).length).toBeGreaterThan(0);
  });
});

describe('HistoryPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows the empty state with a link to the editor when there is no history', async () => {
    (getHistory as jest.Mock).mockResolvedValue([]);

    render(await HistoryPage());

    expect(screen.getByText("You haven't executed any requests yet")).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Go to Editor' })).toHaveAttribute('href', '/');
  });

  it('renders a HistoryCard for each entry when history exists', async () => {
    (getHistory as jest.Mock).mockResolvedValue([
      { id: '1', url: '/pets' },
      { id: '2', url: '/owners' },
    ]);

    render(await HistoryPage());

    expect(screen.getByText('Request History')).toBeInTheDocument();
    expect(await screen.findByText('entry: /pets')).toBeInTheDocument();
    expect(await screen.findByText('entry: /owners')).toBeInTheDocument();
  });

  it('treats a non-ApiError thrown by getHistory as unexpected and re-throws it', async () => {
    (getHistory as jest.Mock).mockRejectedValue(new Error('boom'));

    await expect(HistoryPage()).rejects.toThrow('boom');
  });

  it('swallows an ApiError from getHistory and shows the empty state', async () => {
    (getHistory as jest.Mock).mockRejectedValue(new ApiError(401, 'Unauthorized'));

    render(await HistoryPage());

    expect(screen.getByText("You haven't executed any requests yet")).toBeInTheDocument();
  });
});
