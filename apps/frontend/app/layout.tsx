import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

import { AuthProvider } from '@/components/providers/AuthProvider';
import { ToastProvider } from '@/components/providers/ToastProvider';

import './globals.css';
import { getSession } from './lib/api/session';
import { AppHeader } from '@/components/header/Header';
import { AppFooter } from '@/components/footer/Footer';

export const metadata: Metadata = {
  title: 'Swagger Editor',
  description: 'OpenAPI/Swagger UI editor and viewer',
};

const RTL_LOCALES = new Set(['he']);

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  const locale = await getLocale();
  const messages = await getMessages();
  const dir = RTL_LOCALES.has(locale) ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} className="h-full">
      <body className="h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <ToastProvider>
            <AuthProvider user={user}>
              <AppHeader />
              <main className="flex-1 flex flex-col">{children}</main>
              <AppFooter />
            </AuthProvider>
          </ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
