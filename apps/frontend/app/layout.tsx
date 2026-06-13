import type { Metadata } from 'next';

import { AuthProvider } from '@/components/providers/AuthProvider';

import './globals.css';
import { getSession } from './lib/api/session';
import { AppHeader } from '@/components/header/Header';

export const metadata: Metadata = {
  title: 'Swagger Editor',
  description: 'OpenAPI/Swagger UI editor and viewer',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();

  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">
        <AuthProvider user={user}>
          <AppHeader />
          <main className="flex-1">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
