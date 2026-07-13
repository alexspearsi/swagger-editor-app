import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { serverFetch } from '@/app/lib/api/server';

interface ProxyRequestBody {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: string;
}

interface HistoryPayload {
  url: string;
  method: string;
  statusCode?: number | null;
  duration: number;
  requestSize: number;
  responseSize: number;
  errorDetails?: string | null;
}

async function logHistory(payload: HistoryPayload): Promise<void> {
  try {
    await serverFetch('/history', { method: 'post', data: payload });
  } catch {
    return;
  }
}

export async function POST(request: NextRequest) {
  let data: ProxyRequestBody;

  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { url, method, headers = {}, body } = data;

  if (!url || !method) {
    return NextResponse.json({ error: 'url and method are required' }, { status: 400 });
  }

  const startTime = Date.now();
  const requestSize = body ? new TextEncoder().encode(body).length : 0;

  try {
    const response = await fetch(url, {
      method: method.toUpperCase(),
      headers,
      body: body ?? undefined,
    });

    const duration = Date.now() - startTime;
    const responseText = await response.text();
    const responseSize = new TextEncoder().encode(responseText).length;

    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    await logHistory({
      url,
      method,
      statusCode: response.status,
      duration,
      requestSize,
      responseSize,
    });

    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      body: responseText,
      duration,
      requestSize,
      responseSize,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Request failed';

    await logHistory({
      url,
      method,
      statusCode: null,
      duration,
      requestSize,
      responseSize: 0,
      errorDetails: errorMessage,
    });

    return NextResponse.json({
      status: 0,
      statusText: 'Network Error',
      headers: {},
      body: '',
      duration,
      requestSize,
      responseSize: 0,
      error: errorMessage,
    });
  }
}
