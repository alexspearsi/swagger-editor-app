/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';

import { middleware } from '@/middleware';

function makeToken(exp: number): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const payload = Buffer.from(JSON.stringify({ exp })).toString('base64');

  return `${header}.${payload}.signature`;
}

function requestTo(path: string, cookie?: string): NextRequest {
  const headers: Record<string, string> = {};

  if (cookie) {
    headers.cookie = cookie;
  }

  return new NextRequest(new URL(path, 'https://example.com'), { headers });
}

const futureExp = Math.floor(Date.now() / 1000) + 3600;
const pastExp = Math.floor(Date.now() / 1000) - 3600;

describe('middleware', () => {
  it('redirects away from /history when there is no access_token cookie', () => {
    const response = middleware(requestTo('/history'));

    expect(response.headers.get('location')).toBe('https://example.com/');
  });

  it('redirects away from /history when the token is expired', () => {
    const response = middleware(requestTo('/history', `access_token=${makeToken(pastExp)}`));

    expect(response.headers.get('location')).toBe('https://example.com/');
  });

  it('redirects away from /history when the cookie is not a valid JWT', () => {
    const response = middleware(requestTo('/history', 'access_token=not-a-jwt'));

    expect(response.headers.get('location')).toBe('https://example.com/');
  });

  it('allows /history through when the token is valid', () => {
    const response = middleware(requestTo('/history', `access_token=${makeToken(futureExp)}`));

    expect(response.headers.get('location')).toBeNull();
  });

  it('redirects away from /sign-in when already authenticated with a valid token', () => {
    const response = middleware(requestTo('/sign-in', `access_token=${makeToken(futureExp)}`));

    expect(response.headers.get('location')).toBe('https://example.com/');
  });

  it('allows /sign-in through when there is no token', () => {
    const response = middleware(requestTo('/sign-in'));

    expect(response.headers.get('location')).toBeNull();
  });

  it('allows /sign-in through when the token is expired', () => {
    const response = middleware(requestTo('/sign-in', `access_token=${makeToken(pastExp)}`));

    expect(response.headers.get('location')).toBeNull();
  });
});
