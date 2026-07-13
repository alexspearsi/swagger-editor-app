import type { HistoryEntry } from '@/app/lib/api/history';
import { METHOD_COLORS, statusColor } from '@/app/lib/ui/colors';
import { Badge } from '@/components/ui/Badge';

export function HistoryCard({ entry }: { entry: HistoryEntry }) {
  return (
    <div className="rounded-lg border bg-white p-4 space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <Badge
          className={`uppercase ${METHOD_COLORS[entry.method.toLowerCase() as keyof typeof METHOD_COLORS] ?? 'bg-gray-100 text-gray-600'}`}
        >
          {entry.method}
        </Badge>
        <Badge className={statusColor(entry.statusCode)}>{entry.statusCode ?? 'ERR'}</Badge>
        <span className="text-sm font-mono text-gray-700 truncate flex-1">{entry.url}</span>
      </div>
      <div className="flex gap-4 text-xs text-gray-400 flex-wrap">
        <span>{new Date(entry.timestamp).toLocaleString()}</span>
        <span>{entry.duration}ms</span>
        {entry.requestSize != null && <span>req: {entry.requestSize}B</span>}
        {entry.responseSize != null && <span>res: {entry.responseSize}B</span>}
      </div>
      {entry.errorDetails && <p className="text-xs text-red-500">{entry.errorDetails}</p>}
    </div>
  );
}
