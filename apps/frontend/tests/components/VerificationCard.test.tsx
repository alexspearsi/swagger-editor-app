import { screen, waitFor } from '@testing-library/react';

import { VerificationCard } from '@/components/auth/VerificationCard';
import { confirmEmail } from '@/app/lib/api/auth';
import { ApiError } from '@/app/lib/api/client';

import { renderWithProviders } from '../test-utils';

jest.mock('@/app/lib/api/auth', () => ({
  confirmEmail: jest.fn(),
}));

const push = jest.fn();
const refresh = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push, refresh }),
}));

describe('VerificationCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows an error and a Sign In link when no token is provided', () => {
    renderWithProviders(<VerificationCard />);

    expect(screen.getByText('Verification token is missing.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to Sign In' })).toBeInTheDocument();
  });

  it('shows the verifying state, then success once confirmation resolves', async () => {
    (confirmEmail as jest.Mock).mockResolvedValue({ message: 'ok' });

    renderWithProviders(<VerificationCard token="valid-token" />);

    expect(screen.getByText('Verifying your email…')).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText('Your email has been verified! Redirecting to home…'),
      ).toBeInTheDocument();
    });

    expect(confirmEmail).toHaveBeenCalledWith('valid-token');
  });

  it('shows the API error message when confirmation fails', async () => {
    (confirmEmail as jest.Mock).mockRejectedValue(new ApiError(400, 'Token expired'));

    renderWithProviders(<VerificationCard token="expired-token" />);

    await waitFor(() => {
      expect(screen.getByText('Token expired')).toBeInTheDocument();
    });
  });
});
