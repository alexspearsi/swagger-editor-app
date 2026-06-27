'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import type { OnMount } from '@monaco-editor/react';
import * as yaml from 'yaml';
import { Button } from '@heroui/react';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

type Props = {
  format: 'json' | 'yaml';
  onChange: (value: string) => void;
  onFormatChange: (format: 'json' | 'yaml') => void;
};

export function SchemaEditor({ format, onChange, onFormatChange }: Props) {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const handleMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

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
      return null;
    }

    onFormatChange(newFormat);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
        <span className="text-sm font-medium text-gray-600">Schema Editor</span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-400 uppercase">{format}</span>
          <Button size="sm" variant="outline" onPress={handleToggleFormat}>
            → {format === 'json' ? 'YAML' : 'JSON'}
          </Button>
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
