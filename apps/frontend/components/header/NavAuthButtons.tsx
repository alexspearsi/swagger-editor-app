'use client';

import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button, buttonVariants, toast } from '@heroui/react';

import { useAuth } from '@/components/providers/AuthProvider';
import { logout } from '@/app/lib/api/auth';

export function NavAuthButtons() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const t = useTranslations('Nav');

  async function handleLogout() {
    await logout();

    toast.success(t('signOutSuccess'));
    router.refresh();
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <NextLink href="/history" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
          {t('history')}
        </NextLink>
        <Button size="sm" variant="secondary" onPress={handleLogout}>
          {t('signOut')}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <NextLink href="/sign-in" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
        {t('signIn')}
      </NextLink>
      <NextLink href="/sign-up" className={buttonVariants({ variant: 'primary', size: 'sm' })}>
        {t('signUp')}
      </NextLink>
    </div>
  );
}
