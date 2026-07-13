import { fireEvent, screen, waitFor } from '@testing-library/react';
import { toast } from '@heroui/react';

import { SignInForm } from '@/components/auth/SignInForm';
import { login } from '@/app/lib/api/auth';
import { ApiError } from '@/app/lib/api/client';

import { renderWithProviders } from '../test-utils';

jest.mock('@/app/lib/api/auth', () => ({
  login: jest.fn(),
}));

const push = jest.fn();
const refresh = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push, refresh }),
}));

function fillAndSubmit(email: string, password: string) {
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: email } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: password } });
  fireEvent.submit(
    screen.getByRole('button', { name: 'Sign In' }).closest('form') as HTMLFormElement,
  );
}

describe('SignInForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the email and password fields with a submit button', () => {
    renderWithProviders(<SignInForm />);

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('shows a validation error for an invalid email and does not call login', async () => {
    renderWithProviders(<SignInForm />);

    fillAndSubmit('not-an-email', 'anything');

    await waitFor(() => {
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });

    expect(login).not.toHaveBeenCalled();
  });

  it('logs in, shows a success toast and navigates home on valid submit', async () => {
    (login as jest.Mock).mockResolvedValue({ message: 'ok' });
    renderWithProviders(<SignInForm />);

    fillAndSubmit('user@example.com', 'password123');

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({ email: 'user@example.com', password: 'password123' });
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Welcome back!');
    });

    expect(push).toHaveBeenCalledWith('/');
    expect(refresh).toHaveBeenCalled();
  });

  it('shows a danger toast with the server message when login fails', async () => {
    (login as jest.Mock).mockRejectedValue(new ApiError(401, 'Invalid credentials'));
    renderWithProviders(<SignInForm />);

    fillAndSubmit('user@example.com', 'wrong-password');

    await waitFor(() => {
      expect(toast.danger).toHaveBeenCalledWith('Invalid credentials');
    });

    expect(push).not.toHaveBeenCalled();
  });
});
