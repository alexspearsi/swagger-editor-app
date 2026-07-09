'use client';

import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, FieldError, Input, Label, TextField, toast } from '@heroui/react';
import { SignInFormData, signInSchema } from '@/app/lib/api/validation/auth';
import { login } from '@/app/lib/api/auth';
import { ApiError } from '@/app/lib/api/client';

export function SignInForm() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(data: SignInFormData) {
    try {
      await login(data);

      toast.success('Welcome back!');

      router.push('/');
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError) {
        toast.danger(error.message);
      }
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <Card.Header>
        <Card.Title>Sign In</Card.Title>
        <Card.Description>Enter your credentials to continue</Card.Description>
      </Card.Header>

      <Card.Content>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                isInvalid={!!fieldState.error}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                fullWidth
              >
                <Label>Email</Label>
                <Input type="email" placeholder="you@example.com" />
                <FieldError>{fieldState.error?.message}</FieldError>
              </TextField>
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                isInvalid={!!fieldState.error}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                fullWidth
              >
                <Label>Password</Label>
                <Input type="password" placeholder="••••••••" />
                <FieldError>{fieldState.error?.message}</FieldError>
              </TextField>
            )}
          />

          <Button type="submit" variant="primary" fullWidth isDisabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>
      </Card.Content>

      <Card.Footer className="justify-center">
        <p className="text-sm text-gray-500">
          No account?{' '}
          <NextLink href="/sign-up" className="underline hover:text-gray-900">
            Sign Up
          </NextLink>
        </p>
      </Card.Footer>
    </Card>
  );
}
