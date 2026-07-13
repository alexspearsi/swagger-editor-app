'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import type { OnMount } from '@monaco-editor/react';
import * as yaml from 'yaml';
import { Button } from '@heroui/react';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

type Props = {
  format: 'json' | 'yaml';
  onChange: (value: string) => void;
  onFormatChange: (format: 'json' | 'yaml') => void;
  loadContent?: string | null;
  onSave?: () => void;
  isSaving?: boolean;
};

export function SchemaEditor({
  format,
  onChange,
  onFormatChange,
  loadContent,
  onSave,
  isSaving,
}: Props) {
  const t = useTranslations('Editor');
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const pendingValueRef = useRef<string | null>(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  });

  const handleMount: OnMount = (editor) => {
    editorRef.current = editor;

    if (pendingValueRef.current !== null) {
      const value = pendingValueRef.current;

      editor.setValue(value);

      onChangeRef.current(value);
      pendingValueRef.current = null;
    }
  };

  useEffect(() => {
    if (loadContent == null) {
      return;
    }

    if (editorRef.current) {
      editorRef.current.setValue(loadContent);
    } else {
      pendingValueRef.current = loadContent;
      onChangeRef.current(loadContent);
    }
  }, [loadContent]);

  function handleToggleFormat() {
    const current = editorRef.current?.getValue() ?? '';
    const newFormat = format === 'json' ? 'yaml' : 'json';

    if (!current.trim()) {
      onFormatChange(newFormat);
      return;
    }

    try {
      const parsed = format === 'json' ? JSON.parse(current) : yaml.parse(current);
      const converted =
        newFormat === 'json' ? JSON.stringify(parsed, null, 2) : yaml.stringify(parsed);
      editorRef.current?.setValue(converted);
      onChange(converted);
    } catch {
      return;
    }

    onFormatChange(newFormat);
  }

  const saveLabel = isSaving ? t('saving') : t('save');

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
        <span className="text-sm font-medium text-gray-600">{t('schemaEditor')}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-400 uppercase">{format}</span>
          <Button size="sm" variant="outline" onPress={handleToggleFormat}>
            → {format === 'json' ? 'YAML' : 'JSON'}
          </Button>
          {onSave && (
            <Button size="sm" variant="outline" onPress={onSave} isDisabled={isSaving}>
              {saveLabel}
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <MonacoEditor
          height="100%"
          language={format}
          defaultValue=""
          onChange={(val) => onChange(val ?? '')}
          onMount={handleMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            padding: { top: 16 },
          }}
        />
      </div>
    </div>
  );
}
