import { fireEvent, screen, waitFor } from '@testing-library/react';
import { toast } from '@heroui/react';

import { NavAuthButtons } from '@/components/header/NavAuthButtons';
import { logout } from '@/app/lib/api/auth';
import type { User } from '@/types/user';

import { renderWithProviders } from '../test-utils';

jest.mock('@/app/lib/api/auth', () => ({
  logout: jest.fn(),
}));

const refresh = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh }),
}));

const user: User = {
  id: '1',
  email: 'user@example.com',
  displayName: 'Alex',
  isVerified: true,
  isTwoFactorEnabled: false,
  createdAt: new Date().toISOString(),
};

describe('NavAuthButtons', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows Sign In and Sign Up links when not authenticated', () => {
    renderWithProviders(<NavAuthButtons />, { user: null });

    expect(screen.getByRole('link', { name: 'Sign In' })).toHaveAttribute('href', '/sign-in');
    expect(screen.getByRole('link', { name: 'Sign Up' })).toHaveAttribute('href', '/sign-up');
    expect(screen.queryByText('History')).not.toBeInTheDocument();
  });

  it('shows History link and Sign Out button when authenticated', () => {
    renderWithProviders(<NavAuthButtons />, { user });

    expect(screen.getByRole('link', { name: 'History' })).toHaveAttribute('href', '/history');
    expect(screen.getByRole('button', { name: 'Sign Out' })).toBeInTheDocument();
  });

  it('logs out, shows a success toast and refreshes on Sign Out click', async () => {
    (logout as jest.Mock).mockResolvedValue(undefined);
    renderWithProviders(<NavAuthButtons />, { user });

    fireEvent.click(screen.getByRole('button', { name: 'Sign Out' }));

    await waitFor(() => {
      expect(logout).toHaveBeenCalled();
    });

    expect(toast.success).toHaveBeenCalledWith('Signed out successfully');
    expect(refresh).toHaveBeenCalled();
  });
});
