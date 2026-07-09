'use client';

import { useEffect, useState } from 'react';
import NextLink from 'next/link';

import { cn } from '@/app/lib/utils/cn';

import { NavAuthButtons } from './NavAuthButtons';

export function AppHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-2' : 'bg-white py-4',
      )}
    >
      <div className="w-full px-6 flex items-center justify-between">
        <NextLink href="/" className="font-bold text-xl tracking-tight">
          SwaggerUI
        </NextLink>

        <nav>
          <NextLink
            href="/about"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            About
          </NextLink>
        </nav>

        <NavAuthButtons />
      </div>
    </header>
  );
}
