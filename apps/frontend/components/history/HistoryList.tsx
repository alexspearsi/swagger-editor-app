import type { HistoryEntry } from '@/app/lib/api/history';

import { HistoryCard } from './HistoryCard';

export default function HistoryList({ entries }: { entries: HistoryEntry[] }) {
  return (
    <div className="space-y-2">
      {entries.map((entry) => (
        <HistoryCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
