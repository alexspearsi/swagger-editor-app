'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import * as yaml from 'yaml';

import type { OpenAPISchema } from '@/types/openapi';
import { cn } from '@/app/lib/utils/cn';
import { useAuth } from '@/components/providers/AuthProvider';
import { useOrientation } from '@/app/hooks/useOrientation';
import { SchemaEditor } from './SchemaEditor';
import { SchemaViewer } from './SchemaViewer';
import { getSavedSchema, saveSchema } from '@/app/api/schema';
import { toast } from '@heroui/react';

function detectFormat(value: string): 'json' | 'yaml' {
  try {
    JSON.parse(value.trim());
    return 'json';
  } catch {
    return 'yaml';
  }
}

type ParseResult = { data: OpenAPISchema; error: null } | { data: null; error: string | null };

function parseSchema(
  value: string,
  format: 'json' | 'yaml',
  messages: { failedToParse: string; mustBeObject: string; missingFields: string },
): ParseResult {
  if (!value.trim()) {
    return { data: null, error: null };
  }

  let parsed: unknown;

  try {
    parsed = format === 'json' ? JSON.parse(value) : yaml.parse(value);
  } catch (err) {
    const message = err instanceof Error ? err.message : messages.failedToParse;

    return { data: null, error: `Invalid ${format.toUpperCase()}: ${message}` };
  }

  if (!parsed || typeof parsed !== 'object') {
    return { data: null, error: messages.mustBeObject };
  }

  if (!('paths' in parsed) && !('openapi' in parsed) && !('swagger' in parsed)) {
    return { data: null, error: messages.missingFields };
  }

  return { data: parsed as OpenAPISchema, error: null };
}

export function SwaggerWorkspace() {
  const [rawSchema, setRawSchema] = useState('');
  const [format, setFormat] = useState<'json' | 'yaml'>('yaml');
  const [loadContent, setLoadContent] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { isAuthenticated } = useAuth();
  const isLandscape = useOrientation();
  const t = useTranslations('Editor');

  const { data: parsedSchema, error: schemaError } = useMemo(
    () =>
      parseSchema(rawSchema, format, {
        failedToParse: t('failedToParse'),
        mustBeObject: t('mustBeObject'),
        missingFields: t('missingFields'),
      }),
    [rawSchema, format, t],
  );

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
      toast.success(t('saved'));
    } catch {
      toast.danger(t('saveFailed'));
    } finally {
      setIsSaving(false);
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
        />
      </div>
      <div className={isLandscape ? 'w-1/2 border-l' : 'h-1/2 border-t'}>
        <SchemaViewer schema={parsedSchema} error={schemaError} />
      </div>
    </div>
  );
}
