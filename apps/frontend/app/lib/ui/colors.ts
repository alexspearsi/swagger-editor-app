import type { HttpMethod } from '@/types/openapi';

export const METHOD_COLORS: Record<HttpMethod, string> = {
  get: 'bg-green-100 text-green-700',
  post: 'bg-blue-100 text-blue-700',
  put: 'bg-orange-100 text-orange-700',
  patch: 'bg-yellow-100 text-yellow-700',
  delete: 'bg-red-100 text-red-700',
  head: 'bg-gray-100 text-gray-600',
  options: 'bg-gray-100 text-gray-600',
};

export const PARAM_IN_COLORS: Record<string, string> = {
  path: 'bg-purple-100 text-purple-700',
  query: 'bg-blue-100 text-blue-700',
  header: 'bg-gray-100 text-gray-600',
  cookie: 'bg-orange-100 text-orange-700',
};

export function statusColor(code: number | null): string {
  if (!code) return 'bg-gray-100 text-gray-600';
  if (code < 300) return 'bg-green-100 text-green-700';
  if (code < 400) return 'bg-blue-100 text-blue-700';
  if (code < 500) return 'bg-red-100 text-red-700';
  return 'bg-orange-100 text-orange-700';
}
