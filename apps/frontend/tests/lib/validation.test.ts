import { signInSchema, signUpSchema } from '@/app/lib/api/validation/auth';

describe('signInSchema', () => {
  it('accepts a valid email and non-empty password', () => {
    const result = signInSchema.safeParse({ email: 'user@example.com', password: 'anything' });

    expect(result.success).toBe(true);
  });

  it('rejects an invalid email', () => {
    const result = signInSchema.safeParse({ email: 'not-an-email', password: 'anything' });

    expect(result.success).toBe(false);
  });

  it('rejects an empty password', () => {
    const result = signInSchema.safeParse({ email: 'user@example.com', password: '' });

    expect(result.success).toBe(false);
  });
});

describe('signUpSchema', () => {
  const base = {
    name: 'Alex',
    email: 'user@example.com',
    password: 'Password1!',
    passwordRepeat: 'Password1!',
  };

  it('accepts valid sign-up data', () => {
    expect(signUpSchema.safeParse(base).success).toBe(true);
  });

  it('accepts a Unicode (Cyrillic) letter as satisfying the letter requirement', () => {
    const result = signUpSchema.safeParse({
      ...base,
      password: 'Пароль1!',
      passwordRepeat: 'Пароль1!',
    });

    expect(result.success).toBe(true);
  });

  it('rejects a password shorter than 8 characters', () => {
    const result = signUpSchema.safeParse({
      ...base,
      password: 'P1!aaa',
      passwordRepeat: 'P1!aaa',
    });

    expect(result.success).toBe(false);
  });

  it('rejects a password without a digit', () => {
    const result = signUpSchema.safeParse({
      ...base,
      password: 'Password!',
      passwordRepeat: 'Password!',
    });

    expect(result.success).toBe(false);
  });

  it('rejects a password without a special character', () => {
    const result = signUpSchema.safeParse({
      ...base,
      password: 'Password1',
      passwordRepeat: 'Password1',
    });

    expect(result.success).toBe(false);
  });

  it('rejects mismatched password confirmation with an error on passwordRepeat', () => {
    const result = signUpSchema.safeParse({ ...base, passwordRepeat: 'Different1!' });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['passwordRepeat']);
    }
  });
});
