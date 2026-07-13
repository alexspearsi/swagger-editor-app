import NextLink from 'next/link';
import { getTranslations } from 'next-intl/server';

export async function AppFooter() {
  const t = await getTranslations('Footer');

  return (
    <footer className="border-t bg-white py-6 shrink-0">
      <div className="w-full px-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} SwaggerUI. {t('builtFor')}{' '}
          <a
            href="https://rs.school"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-900"
          >
            RS School
          </a>
          .
        </p>
        <NextLink
          href="/about"
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          {t('about')}
        </NextLink>
      </div>
    </footer>
  );
}
