import { fireEvent, screen, waitFor } from '@testing-library/react';
import { toast } from '@heroui/react';

import { TryItOut } from '@/components/swagger/TryItOut';
import { executeRequest } from '@/app/lib/swagger/proxy';
import type { Operation } from '@/types/openapi';

import { renderWithProviders } from '../test-utils';

jest.mock('@/app/lib/swagger/proxy', () => ({
  executeRequest: jest.fn(),
}));

const writeText = jest.fn();

beforeAll(() => {
  Object.assign(navigator, { clipboard: { writeText } });
});

const getOperation: Operation = {
  parameters: [
    { name: 'verbose', in: 'query', schema: { type: 'boolean' } },
    { name: 'X-Trace-Id', in: 'header' },
    { name: 'session', in: 'cookie' },
  ],
};

describe('TryItOut', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders path, query, header and cookie parameter inputs', () => {
    renderWithProviders(
      <TryItOut
        path="/pets/{id}"
        method="get"
        operation={getOperation}
        serverUrl="https://api.example.com"
      />,
    );

    expect(screen.getByText('{id}')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('id')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('X-Trace-Id')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('session')).toBeInTheDocument();
    expect(screen.queryByLabelText('Request Body')).not.toBeInTheDocument();
    expect(screen.queryByText('Request Body')).not.toBeInTheDocument();
  });

  it('shows a request body field for POST/PUT/PATCH but not GET', () => {
    renderWithProviders(
      <TryItOut path="/pets" method="post" operation={{}} serverUrl="https://api.example.com" />,
    );

    expect(screen.getByPlaceholderText('{"key": "value"}')).toBeInTheDocument();
  });

  it('executes the request with the built URL, headers and body', async () => {
    (executeRequest as jest.Mock).mockResolvedValue({
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      body: '{"id":"1"}',
      duration: 12,
      requestSize: 0,
      responseSize: 10,
    });

    renderWithProviders(
      <TryItOut
        path="/pets/{id}"
        method="get"
        operation={getOperation}
        serverUrl="https://api.example.com"
      />,
    );

    fireEvent.change(screen.getByPlaceholderText('id'), { target: { value: '42' } });
    fireEvent.change(screen.getByPlaceholderText('X-Trace-Id'), { target: { value: 'trace-1' } });
    fireEvent.change(screen.getByPlaceholderText('session'), { target: { value: 'sess-1' } });

    fireEvent.click(screen.getByRole('button', { name: 'Execute' }));

    await waitFor(() => {
      expect(executeRequest).toHaveBeenCalledWith({
        url: 'https://api.example.com/pets/42',
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'X-Trace-Id': 'trace-1',
          Cookie: 'session=sess-1',
        },
        body: undefined,
      });
    });

    await waitFor(() => {
      expect(screen.getByText('200 OK')).toBeInTheDocument();
    });
    expect(screen.getByText('12ms')).toBeInTheDocument();
    expect(screen.getByText('10B')).toBeInTheDocument();
    expect(screen.getByText(/"id": "1"/)).toBeInTheDocument();
  });

  it('adds and removes query parameter rows', () => {
    renderWithProviders(
      <TryItOut path="/pets" method="get" operation={{}} serverUrl="https://api.example.com" />,
    );

    fireEvent.click(screen.getAllByText('+ Add')[0]);
    const keyInputs = screen.getAllByPlaceholderText('key');
    expect(keyInputs).toHaveLength(1);

    fireEvent.click(screen.getAllByText('✕')[0]);
    expect(screen.queryAllByPlaceholderText('key')).toHaveLength(0);
  });

  it('copies a cURL command and shows a success toast', () => {
    renderWithProviders(
      <TryItOut path="/pets" method="get" operation={{}} serverUrl="https://api.example.com" />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Copy cURL' }));

    expect(writeText).toHaveBeenCalledWith(
      expect.stringContaining("curl -X GET 'https://api.example.com/pets'"),
    );
    expect(toast.success).toHaveBeenCalledWith('cURL copied to clipboard');
  });

  it('shows the error message when the response contains one', async () => {
    (executeRequest as jest.Mock).mockResolvedValue({
      status: 0,
      statusText: 'Network Error',
      headers: {},
      body: '',
      duration: 5,
      requestSize: 0,
      responseSize: 0,
      error: 'DNS lookup failed',
    });

    renderWithProviders(
      <TryItOut path="/pets" method="get" operation={{}} serverUrl="https://api.example.com" />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Execute' }));

    await waitFor(() => {
      expect(screen.getByText('DNS lookup failed')).toBeInTheDocument();
    });
  });
});
