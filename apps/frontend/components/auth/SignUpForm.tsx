'use client';

import { useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, FieldError, Input, Label, TextField } from '@heroui/react';

import { register as registerUser } from '@/app/lib/api/auth';
import { ApiError } from '@/app/lib/api/client';
import { SignUpFormData, signUpSchema } from '@/app/lib/api/validation/auth';

export function SignUpForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '', passwordRepeat: '' },
  });

  async function onSubmit(data: SignUpFormData) {
    setServerError(null);
    try {
      await registerUser(data);

      router.push('/');
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError) {
        setServerError(error.message);
      }
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <Card.Header>
        <Card.Title>Sign Up</Card.Title>
        <Card.Description>Create an account to get started</Card.Description>
      </Card.Header>

      <Card.Content>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                isInvalid={!!fieldState.error}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                fullWidth
              >
                <Label>Name</Label>
                <Input placeholder="Alex Spears" />
                <FieldError>{fieldState.error?.message}</FieldError>
              </TextField>
            )}
          />

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
                <Input type="email" placeholder="alexspears@yahoo.com" />
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

          <Controller
            name="passwordRepeat"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                isInvalid={!!fieldState.error}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                fullWidth
              >
                <Label>Repeat Password</Label>
                <Input type="password" placeholder="••••••••" />
                <FieldError>{fieldState.error?.message}</FieldError>
              </TextField>
            )}
          />

          {serverError && <p className="text-sm text-red-500">{serverError}</p>}

          <Button type="submit" variant="primary" fullWidth isDisabled={isSubmitting}>
            {isSubmitting ? 'Creating account…' : 'Sign Up'}
          </Button>
        </form>
      </Card.Content>

      <Card.Footer className="justify-center">
        <p className="text-sm text-gray-500">
          Already have an account?{' '}
          <NextLink href="/sign-in" className="underline hover:text-gray-900">
            Sign In
          </NextLink>
        </p>
      </Card.Footer>
    </Card>
  );
}
