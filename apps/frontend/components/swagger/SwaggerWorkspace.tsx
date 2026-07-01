'use client';

import { useEffect, useMemo, useState } from 'react';
import * as yaml from 'yaml';

import type { OpenAPISchema } from '@/types/openapi';
import { cn } from '@/app/lib/utils/cn';
import { useAuth } from '@/components/providers/AuthProvider';
import { useOrientation } from '@/app/hooks/useOrientation';
import { SchemaEditor } from './SchemaEditor';
import { SchemaViewer } from './SchemaViewer';
import { getSavedSchema, saveSchema } from '@/app/api/schema';

function detectFormat(value: string): 'json' | 'yaml' {
  try {
    JSON.parse(value.trim());
    return 'json';
  } catch {
    return 'yaml';
  }
}

function parseSchema(value: string, format: 'json' | 'yaml'): OpenAPISchema | null {
  if (!value.trim()) return null;
  try {
    const parsed = format === 'json' ? JSON.parse(value) : yaml.parse(value);
    if (!parsed || typeof parsed !== 'object') return null;
    if (!('paths' in parsed) && !('openapi' in parsed) && !('swagger' in parsed)) return null;
    return parsed as OpenAPISchema;
  } catch {
    return null;
  }
}

export function SwaggerWorkspace() {
  const [rawSchema, setRawSchema] = useState('');
  const [format, setFormat] = useState<'json' | 'yaml'>('yaml');
  const [loadContent, setLoadContent] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const { isAuthenticated } = useAuth();
  const isLandscape = useOrientation();

  const parsedSchema = useMemo(() => parseSchema(rawSchema, format), [rawSchema, format]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    getSavedSchema().then((data) => {
      if (data?.content) {
        setLoadContent(data.content);
      }
    });
  }, [isAuthenticated]);

  async function handleSave() {
    if (!rawSchema.trim() || isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      await saveSchema(rawSchema);

      setSaveStatus('saved');
    } catch {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);

      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  }

  function handleChange(value: string) {
    if (value.trim()) {
      setFormat(detectFormat(value));
    }

    setRawSchema(value);
  }

  return (
    <div
      className={cn('flex flex-1 overflow-hidden min-h-0', isLandscape ? 'flex-row' : 'flex-col')}
    >
      <div className={isLandscape ? 'w-1/2' : 'h-1/2'}>
        <SchemaEditor
          format={format}
          onChange={handleChange}
          onFormatChange={setFormat}
          loadContent={loadContent}
          onSave={isAuthenticated ? handleSave : undefined}
          isSaving={isSaving}
          saveStatus={saveStatus}
        />
      </div>
      <div className={isLandscape ? 'w-1/2 border-l' : 'h-1/2 border-t'}>
        <SchemaViewer schema={parsedSchema} />
      </div>
    </div>
  );
}
