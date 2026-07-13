'use client';

import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button, Card, toast } from '@heroui/react';

import { confirmEmail } from '@/app/lib/api/auth';
import { ApiError } from '@/app/lib/api/client';

type Status = 'loading' | 'success' | 'error';

type Props = {
  token?: string;
};

export function VerificationCard({ token }: Props) {
  const router = useRouter();
  const t = useTranslations('Verification');
  const [status, setStatus] = useState<Status>(() => (token ? 'loading' : 'error'));
  const [error, setError] = useState<string | null>(() => (token ? null : t('tokenMissing')));

  useEffect(() => {
    if (!token) {
      return;
    }

    confirmEmail(token)
      .then(() => {
        setStatus('success');

        setTimeout(() => {
          router.push('/');
          router.refresh();
        }, 3000);
      })
      .catch((err) => {
        setStatus('error');

        const message = err instanceof ApiError ? err.message : t('genericError');

        setError(message);
        toast.danger(message);
      });
  }, [token, router, t]);

  return (
    <Card className="w-full max-w-sm">
      <Card.Header>
        <Card.Title>{t('title')}</Card.Title>
        <Card.Description>{t('description')}</Card.Description>
      </Card.Header>

      <Card.Content className="flex flex-col items-center gap-4 py-6">
        {status === 'loading' && <p className="text-sm text-gray-500">{t('verifying')}</p>}

        {status === 'success' && <p className="text-sm text-green-600">{t('success')}</p>}

        {status === 'error' && (
          <>
            <p className="text-sm text-red-500">{error}</p>
            <Button variant="primary" onPress={() => router.push('/sign-in')}>
              {t('goToSignIn')}
            </Button>
          </>
        )}
      </Card.Content>

      {status !== 'loading' && (
        <Card.Footer className="justify-center">
          <p className="text-sm text-gray-500">
            <NextLink href="/sign-in" className="underline hover:text-gray-900">
              {t('backToSignIn')}
            </NextLink>
          </p>
        </Card.Footer>
      )}
    </Card>
  );
}
