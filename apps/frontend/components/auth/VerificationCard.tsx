'use client';

import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Card, toast } from '@heroui/react';

import { confirmEmail } from '@/app/lib/api/auth';
import { ApiError } from '@/app/lib/api/client';

type Status = 'loading' | 'success' | 'error';

type Props = {
  token?: string;
};

export function VerificationCard({ token }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>(() => (token ? 'loading' : 'error'));
  const [error, setError] = useState<string | null>(() =>
    token ? null : 'Verification token is missing.',
  );

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

        const message =
          err instanceof ApiError ? err.message : 'Something went wrong. Please try again.';

        setError(message);
        toast.danger(message);
      });
  }, [token, router]);

  return (
    <Card className="w-full max-w-sm">
      <Card.Header>
        <Card.Title>Email Verification</Card.Title>
        <Card.Description>Confirming your email address</Card.Description>
      </Card.Header>

      <Card.Content className="flex flex-col items-center gap-4 py-6">
        {status === 'loading' && <p className="text-sm text-gray-500">Verifying your email…</p>}

        {status === 'success' && (
          <p className="text-sm text-green-600">
            Your email has been verified! Redirecting to home…
          </p>
        )}

        {status === 'error' && (
          <>
            <p className="text-sm text-red-500">{error}</p>
            <Button variant="primary" onPress={() => router.push('/sign-in')}>
              Go to Sign In
            </Button>
          </>
        )}
      </Card.Content>

      {status !== 'loading' && (
        <Card.Footer className="justify-center">
          <p className="text-sm text-gray-500">
            Back to{' '}
            <NextLink href="/sign-in" className="underline hover:text-gray-900">
              Sign In
            </NextLink>
          </p>
        </Card.Footer>
      )}
    </Card>
  );
}
