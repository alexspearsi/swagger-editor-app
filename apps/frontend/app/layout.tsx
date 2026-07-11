import type { Metadata } from 'next';

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();

  return (
    <html lang="en" className="h-full">
      <body className="h-full flex flex-col">
        <ToastProvider>
          <AuthProvider user={user}>
            <AppHeader />
            <main className="flex-1 flex flex-col">{children}</main>
            <AppFooter />
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
