'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { ListBox, Select } from '@heroui/react';
import type { Key } from 'react-aria-components';

import { LOCALE_COOKIE, locales } from '@/i18n/locales';

const LOCALE_LABELS: Record<string, string> = {
  en: 'EN',
  ru: 'RU',
  he: 'HE',
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('LanguageSwitcher');
  const [isPending, startTransition] = useTransition();

  function handleChange(key: Key | null) {
    if (key === null) {
      return;
    }

    document.cookie = `${LOCALE_COOKIE}=${key}; path=/; max-age=31536000`;

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <Select
      selectedKey={locale}
      onSelectionChange={handleChange}
      isDisabled={isPending}
      aria-label={t('label')}
      variant="secondary"
    >
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {locales.map((code) => (
            <ListBox.Item key={code} id={code}>
              {LOCALE_LABELS[code]}
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
