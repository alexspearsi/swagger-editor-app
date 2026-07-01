import { serverFetch } from './server';

export interface HistoryEntry {
  id: string;
  url: string;
  method: string;
  statusCode: number | null;
  duration: number;
  requestSize: number | null;
  responseSize: number | null;
  errorDetails: string | null;
  timestamp: string;
}

export async function getHistory(): Promise<HistoryEntry[]> {
  return serverFetch<HistoryEntry[]>('/history');
}
