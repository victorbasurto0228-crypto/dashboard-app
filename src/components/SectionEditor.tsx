import { SchemaField } from '../types';
import { FieldRenderer } from './FieldRenderer';

interface SectionEditorProps {
  section: string;
  schema: Record<string, SchemaField>;
  values: Record<string, unknown>;
  onChange: (section: string, field: string, value: unknown) => void;
}

export function SectionEditor({
  section,
  schema,
  values,
  onChange,
}: SectionEditorProps) {
  const title = section.charAt(0).toUpperCase() + section.slice(1);

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-3 rounded-t-xl">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          {title}
        </h3>
      </div>
      <div className="p-6 flex flex-col gap-5">
        {Object.entries(schema).map(([fieldName, field]) => (
          <FieldRenderer
            key={fieldName}
            name={fieldName}
            field={field}
            value={values[fieldName]}
            onChange={(v) => onChange(section, fieldName, v)}
          />
        ))}
      </div>
    </div>
  );
}
