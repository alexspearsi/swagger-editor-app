import { useEffect, useState } from 'react';

type Props = {
  format: 'json' | 'yaml';
  onChange: (value: string) => void;
  onFormatChange: (format: 'json' | 'yaml') => void;
  loadContent?: string | null;
  onSave?: () => void;
  isSaving?: boolean;
};

export function SchemaEditor({ onChange, loadContent, onSave, isSaving }: Props) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (loadContent != null) {
      setValue(loadContent);
      onChange(loadContent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadContent]);

  function handleChange(next: string) {
    setValue(next);
    onChange(next);
  }

  return (
    <div>
      <label htmlFor="schema-stub">schema</label>
      <textarea
        id="schema-stub"
        aria-label="schema"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
      />
      {onSave && (
        <button type="button" onClick={onSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      )}
    </div>
  );
}
