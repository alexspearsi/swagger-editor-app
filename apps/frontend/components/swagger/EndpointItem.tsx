'use client';

import { useState } from 'react';

import type { HttpMethod, MediaType, Operation, Parameter } from '@/types/openapi';
import { cn } from '@/app/lib/utils/cn';
import { METHOD_COLORS, PARAM_IN_COLORS, statusColor } from '@/app/lib/ui/colors';
import { Badge } from '@/components/ui/Badge';
import { TryItOut } from './TryItOut';

type Props = {
  path: string;
  method: HttpMethod;
  operation: Operation;
  serverUrl: string;
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
        <Badge className={cn('w-16 shrink-0 text-center uppercase', METHOD_COLORS[method])}>
          {method}
        </Badge>
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
                  <MediaContent media={media} />
                </div>
              ))}
            </section>
          )}

          {Object.keys(responses).length > 0 && (
            <section>
              <h4 className="mb-2 text-xs font-semibold uppercase text-gray-400">Responses</h4>
              <div className="space-y-3">
                {Object.entries(responses).map(([status, response]) => (
                  <div key={status}>
                    <div className="flex items-start gap-2">
                      <Badge className={cn('shrink-0', statusColor(Number(status) || null))}>
                        {status}
                      </Badge>
                      <span className="text-xs text-gray-600">{response.description}</span>
                    </div>
                    {Object.entries(response.content ?? {}).map(([contentType, media]) => (
                      <div key={contentType} className="mt-1 ml-18">
                        <span className="text-xs font-mono text-gray-500">{contentType}</span>
                        <MediaContent media={media} />
                      </div>
                    ))}
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

function MediaContent({ media }: { media: MediaType }) {
  const example = media.example ?? media.schema?.example;

  return (
    <div className="mt-1 space-y-2">
      {example !== undefined && (
        <div>
          <span className="text-[10px] font-semibold uppercase text-gray-400">Example</span>
          <pre className="mt-1 overflow-auto rounded bg-gray-900 p-3 text-xs text-gray-100">
            {JSON.stringify(example, null, 2)}
          </pre>
        </div>
      )}
      {media.schema && (
        <div>
          <span className="text-[10px] font-semibold uppercase text-gray-400">Schema</span>
          <pre className="mt-1 overflow-auto rounded bg-gray-900 p-3 text-xs text-gray-100">
            {JSON.stringify(media.schema, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

function ParamRow({ param }: { param: Parameter }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <Badge
        className={cn(
          'w-14 shrink-0 text-center',
          PARAM_IN_COLORS[param.in] ?? 'bg-gray-100 text-gray-600',
        )}
      >
        {param.in}
      </Badge>
      <span className="font-mono font-medium text-gray-800">{param.name}</span>
      {param.required && <span className="text-red-400">*</span>}
      {param.schema?.type && <span className="text-gray-400">{param.schema.type}</span>}
      {param.description && <span className="text-gray-500 truncate">{param.description}</span>}
    </div>
  );
}
