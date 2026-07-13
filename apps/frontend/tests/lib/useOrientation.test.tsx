import { act, renderHook } from '@testing-library/react';

import { useOrientation } from '@/app/hooks/useOrientation';

function mockMatchMedia(initialMatches: boolean) {
  let changeHandler: ((e: MediaQueryListEvent) => void) | null = null;
  let matches = initialMatches;

  window.matchMedia = jest.fn().mockImplementation(() => ({
    get matches() {
      return matches;
    },
    addEventListener: (_event: string, handler: (e: MediaQueryListEvent) => void) => {
      changeHandler = handler;
    },
    removeEventListener: () => {
      changeHandler = null;
    },
  }));

  return {
    setMatches(next: boolean) {
      matches = next;
      changeHandler?.({ matches: next } as MediaQueryListEvent);
    },
  };
}

describe('useOrientation', () => {
  it('returns the initial orientation from matchMedia', () => {
    mockMatchMedia(true);

    const { result } = renderHook(() => useOrientation());

    expect(result.current).toBe(true);
  });

  it('updates when the orientation changes', () => {
    const media = mockMatchMedia(false);

    const { result } = renderHook(() => useOrientation());

    expect(result.current).toBe(false);

    act(() => {
      media.setMatches(true);
    });

    expect(result.current).toBe(true);
  });
});
