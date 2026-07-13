'use client';

import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, FieldError, Input, Label, TextField, toast } from '@heroui/react';

import { register as registerUser } from '@/app/lib/api/auth';
import { ApiError } from '@/app/lib/api/client';
import { SignUpFormData, signUpSchema } from '@/app/lib/api/validation/auth';

export function SignUpForm() {
  const router = useRouter();
  const t = useTranslations('SignUp');

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '', passwordRepeat: '' },
  });

  async function onSubmit(data: SignUpFormData) {
    try {
      await registerUser(data);

      toast.info(t('checkInbox'));

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
        <Card.Title>{t('title')}</Card.Title>
        <Card.Description>{t('description')}</Card.Description>
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
                <Label>{t('name')}</Label>
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
                <Label>{t('email')}</Label>
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
                <Label>{t('password')}</Label>
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
                <Label>{t('passwordRepeat')}</Label>
                <Input type="password" placeholder="••••••••" />
                <FieldError>{fieldState.error?.message}</FieldError>
              </TextField>
            )}
          />

          <Button type="submit" variant="primary" fullWidth isDisabled={isSubmitting}>
            {isSubmitting ? t('submitting') : t('submit')}
          </Button>
        </form>
      </Card.Content>

      <Card.Footer className="justify-center">
        <p className="text-sm text-gray-500">
          {t('haveAccount')}{' '}
          <NextLink href="/sign-in" className="underline hover:text-gray-900">
            {t('signIn')}
          </NextLink>
        </p>
      </Card.Footer>
    </Card>
  );
}
