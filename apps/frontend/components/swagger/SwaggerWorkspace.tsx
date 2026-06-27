'use client';

import { useMemo, useState } from 'react';
import * as yaml from 'yaml';

import type { OpenAPISchema } from '@/types/openapi';

import { SchemaEditor } from './SchemaEditor';
import { SchemaViewer } from './SchemaViewer';
import { useOrientation } from '@/app/hooks/useOrientation';

function detectFormat(value: string): 'json' | 'yaml' {
  try {
    JSON.parse(value.trim());
    return 'json';
  } catch {
    return 'yaml';
  }
}

function parseSchema(value: string, format: 'json' | 'yaml'): OpenAPISchema | null {
  if (!value.trim()) {
    return null;
  }

  try {
    const parsed = format === 'json' ? JSON.parse(value) : yaml.parse(value);

    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    if (!('paths' in parsed) && !('openapi' in parsed) && !('swagger' in parsed)) {
      return null;
    }

    return parsed as OpenAPISchema;
  } catch {
    return null;
  }
}

export function SwaggerWorkspace() {
  const [rawSchema, setRawSchema] = useState('');
  const [format, setFormat] = useState<'json' | 'yaml'>('yaml');
  const isLandscape = useOrientation();

  const parsedSchema = useMemo(() => parseSchema(rawSchema, format), [rawSchema, format]);

  function handleChange(value: string) {
    if (value.trim()) {
      setFormat(detectFormat(value));
    }

    setRawSchema(value);
  }

  return (
    <div
      className={[
        'flex flex-1 overflow-hidden min-h-0',
        isLandscape ? 'flex-row' : 'flex-col',
      ].join(' ')}
    >
      <div className={isLandscape ? 'w-1/2' : 'h-1/2'}>
        <SchemaEditor format={format} onChange={handleChange} onFormatChange={setFormat} />
      </div>
      <div className={isLandscape ? 'w-1/2 border-l' : 'h-1/2 border-t'}>
        <SchemaViewer schema={parsedSchema} />
      </div>
    </div>
  );
}
