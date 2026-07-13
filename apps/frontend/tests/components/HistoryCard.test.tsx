import { screen } from '@testing-library/react';

import { HistoryCard } from '@/components/history/HistoryCard';
import type { HistoryEntry } from '@/app/lib/api/history';

import { renderWithProviders } from '../test-utils';

const baseEntry: HistoryEntry = {
  id: '1',
  url: 'https://api.example.com/pets',
  method: 'GET',
  statusCode: 200,
  duration: 42,
  requestSize: 12,
  responseSize: 256,
  errorDetails: null,
  timestamp: '2026-01-01T00:00:00.000Z',
};

describe('HistoryCard', () => {
  it('renders method, status, url and timing details', () => {
    renderWithProviders(<HistoryCard entry={baseEntry} />);

    expect(screen.getByText('GET')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('https://api.example.com/pets')).toBeInTheDocument();
    expect(screen.getByText('42ms')).toBeInTheDocument();
    expect(screen.getByText('req: 12B')).toBeInTheDocument();
    expect(screen.getByText('res: 256B')).toBeInTheDocument();
  });

  it('shows ERR when there is no status code, and renders error details', () => {
    renderWithProviders(
      <HistoryCard
        entry={{
          ...baseEntry,
          statusCode: null,
          errorDetails: 'Network timeout',
        }}
      />,
    );

    expect(screen.getByText('ERR')).toBeInTheDocument();
    expect(screen.getByText('Network timeout')).toBeInTheDocument();
  });

  it('omits request/response size when not provided', () => {
    renderWithProviders(
      <HistoryCard entry={{ ...baseEntry, requestSize: null, responseSize: null }} />,
    );

    expect(screen.queryByText(/req:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/res:/)).not.toBeInTheDocument();
  });
});
