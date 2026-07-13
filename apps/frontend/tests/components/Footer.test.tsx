import { screen } from '@testing-library/react';

import { AppFooter } from '@/components/footer/Footer';

import { renderWithProviders } from '../test-utils';

describe('AppFooter', () => {
  it('renders the About link and a link to RS School', async () => {
    const ui = await AppFooter();

    renderWithProviders(ui);

    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('link', { name: 'RS School' })).toHaveAttribute(
      'href',
      'https://rs.school',
    );
  });
});
