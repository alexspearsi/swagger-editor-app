export const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: false,
  maxAge: 24 * 60 * 60 * 1000,
};
