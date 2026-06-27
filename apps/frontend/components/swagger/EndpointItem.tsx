'use client';

import { useState } from 'react';

import type { HttpMethod, Operation, Parameter } from '@/types/openapi';
import { TryItOut } from './TryItOut';

type Props = {
  path: string;
  method: HttpMethod;
  operation: Operation;
  serverUrl: string;
};

const METHOD_STYLES: Record<HttpMethod, string> = {
  get: 'bg-green-100  text-green-700',
  post: 'bg-blue-100   text-blue-700',
  put: 'bg-orange-100 text-orange-700',
  delete: 'bg-red-100    text-red-700',
  patch: 'bg-yellow-100 text-yellow-700',
  head: 'bg-gray-100   text-gray-600',
  options: 'bg-gray-100   text-gray-600',
};

const PARAM_IN_STYLES: Record<string, string> = {
  path: 'bg-purple-100 text-purple-700',
  query: 'bg-blue-100   text-blue-700',
  header: 'bg-gray-100   text-gray-600',
  cookie: 'bg-orange-100 text-orange-700',
};

export function EndpointItem({ path, method, operation, serverUrl }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [tryItOut, setTryItOut] = useState(false);

  const {
    summary,
    description,
    parameters = [],
    requestBody,
    responses = {},
    deprecated,
  } = operation;

  return (
    <div className={deprecated ? 'opacity-60' : ''}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
      >
        <span
          className={[
            'w-16 shrink-0 rounded px-2 py-0.5 text-center text-xs font-bold uppercase',
            METHOD_STYLES[method],
          ].join(' ')}
        >
          {method}
        </span>
        <span className="flex-1 font-mono text-sm text-gray-800">{path}</span>
        {summary && <span className="text-xs text-gray-500 truncate max-w-48">{summary}</span>}
        {deprecated && <span className="text-xs text-red-400">deprecated</span>}
        <span className="text-gray-400 text-xs">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="border-t bg-gray-50 px-4 py-4 space-y-4">
          {description && <p className="text-sm text-gray-600">{description}</p>}

          {parameters.length > 0 && (
            <section>
              <h4 className="mb-2 text-xs font-semibold uppercase text-gray-400">Parameters</h4>
              <div className="space-y-1">
                {parameters.map((param) => (
                  <ParamRow key={`${param.in}-${param.name}`} param={param} />
                ))}
              </div>
            </section>
          )}

          {requestBody && (
            <section>
              <h4 className="mb-2 text-xs font-semibold uppercase text-gray-400">
                Request Body{requestBody.required && <span className="ml-1 text-red-400">*</span>}
              </h4>
              {requestBody.description && (
                <p className="mb-1 text-xs text-gray-500">{requestBody.description}</p>
              )}
              {Object.entries(requestBody.content ?? {}).map(([contentType, media]) => (
                <div key={contentType}>
                  <span className="text-xs font-mono text-gray-500">{contentType}</span>
                  {media.schema && (
                    <pre className="mt-1 overflow-auto rounded bg-gray-900 p-3 text-xs text-gray-100">
                      {JSON.stringify(media.schema, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
            </section>
          )}

          {Object.keys(responses).length > 0 && (
            <section>
              <h4 className="mb-2 text-xs font-semibold uppercase text-gray-400">Responses</h4>
              <div className="space-y-2">
                {Object.entries(responses).map(([status, response]) => (
                  <div key={status} className="flex items-start gap-2">
                    <span
                      className={[
                        'shrink-0 rounded px-2 py-0.5 text-xs font-bold',
                        status.startsWith('2')
                          ? 'bg-green-100 text-green-700'
                          : status.startsWith('4')
                            ? 'bg-red-100 text-red-700'
                            : status.startsWith('5')
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-gray-100 text-gray-600',
                      ].join(' ')}
                    >
                      {status}
                    </span>
                    <span className="text-xs text-gray-600">{response.description}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div>
            <button
              onClick={() => setTryItOut((v) => !v)}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              {tryItOut ? 'Hide Try-It-Out ▲' : 'Try it out ▼'}
            </button>

            {tryItOut && (
              <TryItOut path={path} method={method} operation={operation} serverUrl={serverUrl} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ParamRow({ param }: { param: Parameter }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span
        className={[
          'w-14 shrink-0 rounded px-1 py-0.5 text-center text-xs',
          PARAM_IN_STYLES[param.in] ?? 'bg-gray-100 text-gray-600',
        ].join(' ')}
      >
        {param.in}
      </span>
      <span className="font-mono font-medium text-gray-800">{param.name}</span>
      {param.required && <span className="text-red-400">*</span>}
      {param.schema?.type && <span className="text-gray-400">{param.schema.type}</span>}
      {param.description && <span className="text-gray-500 truncate">{param.description}</span>}
    </div>
  );
}
