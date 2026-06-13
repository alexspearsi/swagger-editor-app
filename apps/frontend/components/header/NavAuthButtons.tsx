'use client';

import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, buttonVariants } from '@heroui/react';

import { useAuth } from '@/components/providers/AuthProvider';
import { logout } from '@/app/lib/api/auth';

export function NavAuthButtons() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();

    router.refresh();
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <NextLink href="/history" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
          History
        </NextLink>
        <Button size="sm" variant="secondary" onPress={handleLogout}>
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <NextLink href="/sign-in" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
        Sign In
      </NextLink>
      <NextLink href="/sign-up" className={buttonVariants({ variant: 'primary', size: 'sm' })}>
        Sign Up
      </NextLink>
    </div>
  );
}
