'use client';

import type { HttpMethod, OpenAPISchema } from '@/types/openapi';
import { HTTP_METHODS } from '@/types/openapi';

import { EndpointItem } from './EndpointItem';

type Props = {
  schema: OpenAPISchema | null;
  error?: string | null;
};

export function SchemaViewer({ schema, error }: Props) {
  const serverUrl = schema?.servers?.[0]?.url ?? '';

  if (!schema) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-center">
        {error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : (
          <p className="text-sm text-gray-400">Paste a valid OpenAPI schema in the editor</p>
        )}
      </div>
    );
  }

  const { info, paths } = schema;

  const endpoints = Object.entries(paths ?? {}).flatMap(([path, pathItem]) =>
    HTTP_METHODS.flatMap((method) => {
      const operation = pathItem?.[method];

      if (!operation) {
        return [];
      } else {
        return [{ path, method: method as HttpMethod, operation }];
      }
    }),
  );

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {info && (
        <div className="border-b bg-gray-50 px-4 py-3">
          <h2 className="font-semibold text-gray-900">{info.title}</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">v{info.version}</span>
            {schema.openapi && (
              <span className="text-xs text-gray-400">OpenAPI {schema.openapi}</span>
            )}
          </div>
          {info.description && <p className="mt-1 text-xs text-gray-500">{info.description}</p>}
        </div>
      )}

      <div className="flex-1 overflow-auto divide-y">
        {endpoints.length === 0 ? (
          <p className="p-4 text-sm text-gray-400">No endpoints found in schema</p>
        ) : (
          endpoints.map(({ path, method, operation }) => (
            <EndpointItem
              key={`${method}-${path}`}
              path={path}
              method={method}
              operation={operation}
              serverUrl={serverUrl}
            />
          ))
        )}
      </div>
    </div>
  );
}
