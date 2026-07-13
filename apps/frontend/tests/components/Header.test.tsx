import { screen } from '@testing-library/react';

import { AppHeader } from '@/components/header/Header';

import { renderWithProviders } from '../test-utils';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}));

describe('AppHeader', () => {
  it('renders the brand link, the About nav link and auth buttons', () => {
    renderWithProviders(<AppHeader />, { user: null });

    expect(screen.getByRole('link', { name: 'SwaggerUI' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('link', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign Up' })).toBeInTheDocument();
  });

  it('renders the language switcher', () => {
    renderWithProviders(<AppHeader />, { user: null });

    expect(screen.getByLabelText('Language')).toBeInTheDocument();
  });
});
