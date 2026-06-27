import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface ProxyRequestBody {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: string;
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
    return NextResponse.json({
      status: 0,
      statusText: 'Network Error',
      headers: {},
      body: '',
      duration: Date.now() - startTime,
      requestSize,
      responseSize: 0,
      error: error instanceof Error ? error.message : 'Request failed',
    });
  }
}
