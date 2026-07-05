import Link from 'next/link';

import { ApiError } from '@/app/lib/api/client';
import { getHistory } from '@/app/lib/api/history';
import type { HistoryEntry } from '@/app/lib/api/history';
import { HistoryCard } from '@/components/history/HistoryCard';

export default async function HistoryPage() {
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
        <p className="text-gray-500 text-sm">You haven&#39;t executed any requests yet</p>
        <Link href="/" className="text-sm text-blue-500 hover:underline">
          Go to Editor
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Request History</h1>
      <div className="space-y-2">
        {entries.map((entry) => (
          <HistoryCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}
