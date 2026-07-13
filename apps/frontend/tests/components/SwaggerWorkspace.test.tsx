import { fireEvent, screen, waitFor } from '@testing-library/react';
import { toast } from '@heroui/react';

import { SwaggerWorkspace } from '@/components/swagger/SwaggerWorkspace';
import { getSavedSchema, saveSchema } from '@/app/api/schema';
import type { User } from '@/types/user';

import { renderWithProviders } from '../test-utils';

jest.mock('@/app/api/schema', () => ({
  getSavedSchema: jest.fn(),
  saveSchema: jest.fn(),
}));

jest.mock('@/components/swagger/SchemaEditor', () =>
  jest.requireActual('../mocks/SchemaEditorStub'),
);

const user: User = {
  id: '1',
  email: 'user@example.com',
  displayName: 'Alex',
  isVerified: true,
  isTwoFactorEnabled: false,
  createdAt: new Date().toISOString(),
};

const validSchema = JSON.stringify({
  openapi: '3.0.0',
  info: { title: 'Pet Store', version: '1.0.0' },
  paths: {},
});

describe('SwaggerWorkspace', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getSavedSchema as jest.Mock).mockResolvedValue(null);
  });

  it('shows the placeholder before anything is typed', () => {
    renderWithProviders(<SwaggerWorkspace />, { user: null });

    expect(screen.getByText('Paste a valid OpenAPI schema in the editor')).toBeInTheDocument();
  });

  it('parses a valid JSON schema and renders it in the viewer', async () => {
    renderWithProviders(<SwaggerWorkspace />, { user: null });

    fireEvent.change(screen.getByLabelText('schema'), { target: { value: validSchema } });

    await waitFor(() => {
      expect(screen.getByText('Pet Store')).toBeInTheDocument();
    });
  });

  it('shows a parse error for invalid JSON', async () => {
    renderWithProviders(<SwaggerWorkspace />, { user: null });

    fireEvent.change(screen.getByLabelText('schema'), { target: { value: '{ invalid' } });

    await waitFor(() => {
      expect(screen.getByText(/Invalid YAML:/)).toBeInTheDocument();
    });
  });

  it('does not show a Save button when the user is not authenticated', () => {
    renderWithProviders(<SwaggerWorkspace />, { user: null });

    expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument();
  });

  it('loads the saved schema on mount for an authenticated user', async () => {
    (getSavedSchema as jest.Mock).mockResolvedValue({ content: validSchema });

    renderWithProviders(<SwaggerWorkspace />, { user });

    await waitFor(() => {
      expect(screen.getByText('Pet Store')).toBeInTheDocument();
    });
  });

  it('saves the schema and shows a success toast', async () => {
    (saveSchema as jest.Mock).mockResolvedValue(undefined);
    renderWithProviders(<SwaggerWorkspace />, { user });

    fireEvent.change(screen.getByLabelText('schema'), { target: { value: validSchema } });
    fireEvent.click(await screen.findByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(saveSchema).toHaveBeenCalledWith(validSchema);
    });
    expect(toast.success).toHaveBeenCalledWith('Schema saved');
  });

  it('shows a danger toast when saving fails', async () => {
    (saveSchema as jest.Mock).mockRejectedValue(new Error('network error'));
    renderWithProviders(<SwaggerWorkspace />, { user });

    fireEvent.change(screen.getByLabelText('schema'), { target: { value: validSchema } });
    fireEvent.click(await screen.findByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(toast.danger).toHaveBeenCalledWith('Failed to save schema');
    });
  });
});
