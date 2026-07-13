import type { ReactElement, ReactNode } from 'react';
import { render } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';

import { AuthProvider } from '@/components/providers/AuthProvider';
import { ToastProvider } from '@/components/providers/ToastProvider';
import type { User } from '@/types/user';

import messages from '../messages/en.json';

type Options = {
  user?: User | null;
};

function AllProviders({ children, user = null }: { children: ReactNode; user?: User | null }) {
  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      <ToastProvider>
        <AuthProvider user={user}>{children}</AuthProvider>
      </ToastProvider>
    </NextIntlClientProvider>
  );
}

export function renderWithProviders(ui: ReactElement, { user = null }: Options = {}) {
  return render(<AllProviders user={user}>{ui}</AllProviders>);
}

export * from '@testing-library/react';
