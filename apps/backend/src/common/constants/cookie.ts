export const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  domain: process.env.COOKIE_DOMAIN,
  maxAge: 24 * 60 * 60 * 1000,
};
