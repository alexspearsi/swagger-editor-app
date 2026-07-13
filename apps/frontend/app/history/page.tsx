import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getTranslations } from 'next-intl/server';

import { ApiError } from '@/app/lib/api/client';
import { getHistory } from '@/app/lib/api/history';
import type { HistoryEntry } from '@/app/lib/api/history';

const HistoryList = dynamic(() => import('@/components/history/HistoryList'));

export default async function HistoryPage() {
  const t = await getTranslations('History');
  let entries: HistoryEntry[] = [];

  try {
    entries = await getHistory();
  } catch (error) {
    if (!(error instanceof ApiError)) {
      throw error;
    }
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center">
        <p className="text-gray-500 text-sm">{t('empty')}</p>
        <Link href="/" className="text-sm text-blue-500 hover:underline">
          {t('goToEditor')}
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">{t('title')}</h1>
      <HistoryList entries={entries} />
    </div>
  );
}
