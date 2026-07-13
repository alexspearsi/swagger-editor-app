import { render, screen } from '@testing-library/react';

import { getSession } from '@/app/lib/api/session';

import HomePage from '@/app/page';
import SignInPage from '@/app/(auth)/sign-in/page';
import SignUpPage from '@/app/(auth)/sign-up/page';
import NewVerificationPage from '@/app/(auth)/new-verification/page';

jest.mock('@/app/lib/api/session', () => ({
  getSession: jest.fn(),
}));

const redirect = jest.fn();

jest.mock('next/navigation', () => ({
  redirect: (path: string) => redirect(path),
}));

jest.mock('@/components/swagger/SwaggerWorkspace', () => ({
  SwaggerWorkspace: () => <div>swagger-workspace-stub</div>,
}));

jest.mock('@/components/auth/SignInForm', () => ({
  SignInForm: () => <div>sign-in-form-stub</div>,
}));

jest.mock('@/components/auth/SignUpForm', () => ({
  SignUpForm: () => <div>sign-up-form-stub</div>,
}));

jest.mock('@/components/auth/VerificationCard', () => ({
  VerificationCard: ({ token }: { token?: string }) => <div>token: {token ?? 'none'}</div>,
}));

describe('HomePage', () => {
  it('renders the swagger workspace', () => {
    render(<HomePage />);

    expect(screen.getByText('swagger-workspace-stub')).toBeInTheDocument();
  });
});

describe('SignInPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the sign-in form when not authenticated', async () => {
    (getSession as jest.Mock).mockResolvedValue(null);

    render(await SignInPage());

    expect(screen.getByText('sign-in-form-stub')).toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });

  it('redirects home when already authenticated', async () => {
    (getSession as jest.Mock).mockResolvedValue({ id: '1' });

    await SignInPage();

    expect(redirect).toHaveBeenCalledWith('/');
  });
});

describe('SignUpPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the sign-up form when not authenticated', async () => {
    (getSession as jest.Mock).mockResolvedValue(null);

    render(await SignUpPage());

    expect(screen.getByText('sign-up-form-stub')).toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });

  it('redirects home when already authenticated', async () => {
    (getSession as jest.Mock).mockResolvedValue({ id: '1' });

    await SignUpPage();

    expect(redirect).toHaveBeenCalledWith('/');
  });
});

describe('NewVerificationPage', () => {
  it('passes the token search param through to VerificationCard', async () => {
    render(await NewVerificationPage({ searchParams: Promise.resolve({ token: 'abc' }) }));

    expect(screen.getByText('token: abc')).toBeInTheDocument();
  });

  it('renders with no token when none is provided', async () => {
    render(await NewVerificationPage({ searchParams: Promise.resolve({}) }));

    expect(screen.getByText('token: none')).toBeInTheDocument();
  });
});
