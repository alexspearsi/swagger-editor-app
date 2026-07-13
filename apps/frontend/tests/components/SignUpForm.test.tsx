import { fireEvent, screen, waitFor } from '@testing-library/react';
import { toast } from '@heroui/react';

import { SignUpForm } from '@/components/auth/SignUpForm';
import { register } from '@/app/lib/api/auth';
import { ApiError } from '@/app/lib/api/client';

import { renderWithProviders } from '../test-utils';

jest.mock('@/app/lib/api/auth', () => ({
  register: jest.fn(),
}));

const push = jest.fn();
const refresh = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push, refresh }),
}));

function fillAndSubmit(fields: {
  name: string;
  email: string;
  password: string;
  passwordRepeat: string;
}) {
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: fields.name } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: fields.email } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: fields.password } });
  fireEvent.change(screen.getByLabelText('Repeat Password'), {
    target: { value: fields.passwordRepeat },
  });
  fireEvent.submit(
    screen.getByRole('button', { name: 'Sign Up' }).closest('form') as HTMLFormElement,
  );
}

describe('SignUpForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all fields with a submit button', () => {
    renderWithProviders(<SignUpForm />);

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Repeat Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
  });

  it('rejects a password that is missing a special character', async () => {
    renderWithProviders(<SignUpForm />);

    fillAndSubmit({
      name: 'Alex',
      email: 'user@example.com',
      password: 'Password1',
      passwordRepeat: 'Password1',
    });

    await waitFor(() => {
      expect(screen.getByText('At least one special character')).toBeInTheDocument();
    });

    expect(register).not.toHaveBeenCalled();
  });

  it('rejects mismatched password confirmation', async () => {
    renderWithProviders(<SignUpForm />);

    fillAndSubmit({
      name: 'Alex',
      email: 'user@example.com',
      password: 'Password1!',
      passwordRepeat: 'Different1!',
    });

    await waitFor(() => {
      expect(screen.getByText('Password do not match')).toBeInTheDocument();
    });

    expect(register).not.toHaveBeenCalled();
  });

  it('registers, shows an info toast and navigates home on valid submit', async () => {
    (register as jest.Mock).mockResolvedValue({ message: 'ok' });
    renderWithProviders(<SignUpForm />);

    fillAndSubmit({
      name: 'Alex',
      email: 'user@example.com',
      password: 'Password1!',
      passwordRepeat: 'Password1!',
    });

    await waitFor(() => {
      expect(register).toHaveBeenCalledWith({
        name: 'Alex',
        email: 'user@example.com',
        password: 'Password1!',
        passwordRepeat: 'Password1!',
      });
    });

    await waitFor(() => {
      expect(toast.info).toHaveBeenCalledWith(
        'Check your inbox and confirm your email to activate your account',
      );
    });

    expect(push).toHaveBeenCalledWith('/');
    expect(refresh).toHaveBeenCalled();
  });

  it('shows a danger toast with the server message when registration fails', async () => {
    (register as jest.Mock).mockRejectedValue(new ApiError(409, 'Email already in use'));
    renderWithProviders(<SignUpForm />);

    fillAndSubmit({
      name: 'Alex',
      email: 'user@example.com',
      password: 'Password1!',
      passwordRepeat: 'Password1!',
    });

    await waitFor(() => {
      expect(toast.danger).toHaveBeenCalledWith('Email already in use');
    });

    expect(push).not.toHaveBeenCalled();
  });
});
