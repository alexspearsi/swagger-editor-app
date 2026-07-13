import { METHOD_COLORS, PARAM_IN_COLORS, statusColor } from '@/app/lib/ui/colors';

describe('statusColor', () => {
  it('returns gray for a null code', () => {
    expect(statusColor(null)).toBe('bg-gray-100 text-gray-600');
  });

  it('returns green for 2xx codes', () => {
    expect(statusColor(200)).toBe('bg-green-100 text-green-700');
  });

  it('returns blue for 3xx codes', () => {
    expect(statusColor(301)).toBe('bg-blue-100 text-blue-700');
  });

  it('returns red for 4xx codes', () => {
    expect(statusColor(404)).toBe('bg-red-100 text-red-700');
  });

  it('returns orange for 5xx codes', () => {
    expect(statusColor(500)).toBe('bg-orange-100 text-orange-700');
  });
});

describe('METHOD_COLORS / PARAM_IN_COLORS', () => {
  it('defines a color for every HTTP method', () => {
    expect(Object.keys(METHOD_COLORS).sort()).toEqual(
      ['delete', 'get', 'head', 'options', 'patch', 'post', 'put'].sort(),
    );
  });

  it('defines a color for every parameter location', () => {
    expect(Object.keys(PARAM_IN_COLORS).sort()).toEqual(
      ['cookie', 'header', 'path', 'query'].sort(),
    );
  });
});
