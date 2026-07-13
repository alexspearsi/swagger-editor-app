export interface ProxyRequest {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: string;
}

export interface ProxyResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  duration: number;
  requestSize: number;
  responseSize: number;
  error?: string;
}

export async function executeRequest(req: ProxyRequest): Promise<ProxyResponse> {
  const response = await fetch('/api/proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });

  return response.json() as Promise<ProxyResponse>;
}
