import { fireEvent, screen } from '@testing-library/react';

import { LanguageSwitcher } from '@/components/header/LanguageSwitcher';

import { renderWithProviders } from '../test-utils';

const refresh = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh }),
}));

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.cookie = 'NEXT_LOCALE=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  });

  it('shows the current locale and all language options', () => {
    renderWithProviders(<LanguageSwitcher />);

    expect(screen.getByLabelText('Language')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'EN' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'RU' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'HE' })).toBeInTheDocument();
  });

  it('sets the NEXT_LOCALE cookie and refreshes when a language is chosen', () => {
    renderWithProviders(<LanguageSwitcher />);

    fireEvent.click(screen.getByRole('option', { name: 'RU' }));

    expect(document.cookie).toContain('NEXT_LOCALE=ru');
    expect(refresh).toHaveBeenCalled();
  });
});
