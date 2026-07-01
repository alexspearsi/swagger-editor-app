'use client';

import { useState } from 'react';
import { Button } from '@heroui/react';

import type { HttpMethod, Operation } from '@/types/openapi';
import { statusColor } from '@/app/lib/ui/colors';
import { Badge } from '@/components/ui/Badge';
import { executeRequest, ProxyResponse } from '@/app/lib/swagger/proxy';
import { generateCurl } from '@/app/lib/swagger/curl';

type KeyValue = { key: string; value: string };

type Props = {
  path: string;
  method: HttpMethod;
  operation: Operation;
  serverUrl: string;
};

function extractPathParamNames(path: string): string[] {
  return (path.match(/\{([^}]+)\}/g) ?? []).map((m) => m.slice(1, -1));
}

function buildUrl(
  serverUrl: string,
  path: string,
  pathParams: Record<string, string>,
  queryParams: KeyValue[],
): string {
  let url = serverUrl.replace(/\/$/, '') + path;

  for (const [key, value] of Object.entries(pathParams)) {
    url = url.replace(`{${key}}`, encodeURIComponent(value));
  }

  const query = queryParams
    .filter((p) => p.key && p.value)
    .map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
    .join('&');

  return query ? `${url}?${query}` : url;
}

export function TryItOut({ path, method, operation, serverUrl }: Props) {
  const pathParamNames = extractPathParamNames(path);
  const definedQueryParams = (operation.parameters ?? []).filter((p) => p.in === 'query');

  const [server, setServer] = useState(serverUrl);
  const [pathParams, setPathParams] = useState<Record<string, string>>(
    Object.fromEntries(pathParamNames.map((name) => [name, ''])),
  );
  const [queryParams, setQueryParams] = useState<KeyValue[]>(
    definedQueryParams.map((p) => ({ key: p.name, value: '' })),
  );
  const [headers, setHeaders] = useState<KeyValue[]>([
    { key: 'Content-Type', value: 'application/json' },
  ]);
  const [body, setBody] = useState('');
  const [curlVisible, setCurlVisible] = useState(false);
  const [response, setResponse] = useState<ProxyResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const hasBody = ['post', 'put', 'patch'].includes(method);

  function getRequestHeaders(): Record<string, string> {
    return Object.fromEntries(headers.filter((h) => h.key && h.value).map((h) => [h.key, h.value]));
  }

  function getFinalUrl() {
    return buildUrl(server, path, pathParams, queryParams);
  }

  async function handleExecute() {
    setLoading(true);
    setResponse(null);
    try {
      const result = await executeRequest({
        url: getFinalUrl(),
        method,
        headers: getRequestHeaders(),
        body: hasBody && body ? body : undefined,
      });

      setResponse(result);
    } finally {
      setLoading(false);
    }
  }

  function handleCopyClick() {
    const curl = generateCurl(
      getFinalUrl(),
      method,
      getRequestHeaders(),
      hasBody ? body : undefined,
    );

    navigator.clipboard.writeText(curl);

    setCurlVisible(true);
  }

  function updateKV(
    list: KeyValue[],
    setList: (v: KeyValue[]) => void,
    index: number,
    field: 'key' | 'value',
    value: string,
  ) {
    const updated = [...list];

    updated[index] = { ...updated[index], [field]: value };

    setList(updated);
  }

  return (
    <div className="mt-4 space-y-4 rounded-lg border p-4 bg-white">
      <div>
        <label className="text-xs font-semibold uppercase text-gray-400">Server URL</label>
        <input
          className="mt-1 w-full rounded border px-3 py-1.5 text-sm font-mono"
          value={server}
          onChange={(e) => setServer(e.target.value)}
        />
      </div>

      {pathParamNames.length > 0 && (
        <div>
          <label className="text-xs font-semibold uppercase text-gray-400">Path Parameters</label>
          <div className="mt-1 space-y-1">
            {pathParamNames.map((name) => (
              <div key={name} className="flex items-center gap-2">
                <span className="w-32 text-xs font-mono text-purple-600">{`{${name}}`}</span>
                <input
                  className="flex-1 rounded border px-2 py-1 text-sm"
                  placeholder={name}
                  value={pathParams[name]}
                  onChange={(e) => setPathParams((prev) => ({ ...prev, [name]: e.target.value }))}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase text-gray-400">Query Parameters</label>
          <button
            className="text-xs text-blue-500 hover:underline"
            onClick={() => setQueryParams((prev) => [...prev, { key: '', value: '' }])}
          >
            + Add
          </button>
        </div>
        <div className="mt-1 space-y-1">
          {queryParams.map((param, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                className="flex-1 rounded border px-2 py-1 text-xs font-mono"
                placeholder="key"
                value={param.key}
                onChange={(e) => updateKV(queryParams, setQueryParams, i, 'key', e.target.value)}
              />
              <input
                className="flex-1 rounded border px-2 py-1 text-xs"
                placeholder="value"
                value={param.value}
                onChange={(e) => updateKV(queryParams, setQueryParams, i, 'value', e.target.value)}
              />
              <button
                className="text-red-400 hover:text-red-600 text-xs"
                onClick={() => setQueryParams((prev) => prev.filter((_, j) => j !== i))}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase text-gray-400">Headers</label>
          <button
            className="text-xs text-blue-500 hover:underline"
            onClick={() => setHeaders((prev) => [...prev, { key: '', value: '' }])}
          >
            + Add
          </button>
        </div>
        <div className="mt-1 space-y-1">
          {headers.map((header, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                className="flex-1 rounded border px-2 py-1 text-xs font-mono"
                placeholder="Header-Name"
                value={header.key}
                onChange={(e) => updateKV(headers, setHeaders, i, 'key', e.target.value)}
              />
              <input
                className="flex-1 rounded border px-2 py-1 text-xs"
                placeholder="value"
                value={header.value}
                onChange={(e) => updateKV(headers, setHeaders, i, 'value', e.target.value)}
              />
              <button
                className="text-red-400 hover:text-red-600 text-xs"
                onClick={() => setHeaders((prev) => prev.filter((_, j) => j !== i))}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {hasBody && (
        <div>
          <label className="text-xs font-semibold uppercase text-gray-400">Request Body</label>
          <textarea
            className="mt-1 w-full rounded border px-3 py-2 text-xs font-mono"
            rows={6}
            placeholder='{"key": "value"}'
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button variant="primary" size="sm" onPress={handleExecute} isDisabled={loading}>
          {loading ? 'Executing…' : 'Execute'}
        </Button>
        <Button variant="outline" size="sm" onPress={handleCopyClick}>
          Copy cURL
        </Button>
      </div>

      {curlVisible && (
        <pre className="overflow-auto rounded bg-gray-900 p-3 text-xs text-green-400">
          {generateCurl(getFinalUrl(), method, getRequestHeaders(), hasBody ? body : undefined)}
        </pre>
      )}

      {response && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge className={statusColor(response.status)}>
              {response.status} {response.statusText}
            </Badge>
            <span className="text-xs text-gray-400">{response.duration}ms</span>
            <span className="text-xs text-gray-400">{response.responseSize}B</span>
          </div>

          {response.error && <p className="text-xs text-red-500">{response.error}</p>}

          {response.body && (
            <pre className="max-h-64 overflow-auto rounded bg-gray-900 p-3 text-xs text-gray-100">
              {(() => {
                try {
                  return JSON.stringify(JSON.parse(response.body), null, 2);
                } catch {
                  return response.body;
                }
              })()}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
