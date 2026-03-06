import { SchemaField } from '../types';
import { Button } from './common/Button';

interface FieldRendererProps {
  name: string;
  field: SchemaField;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function FieldRenderer({
  name,
  field,
  value,
  onChange,
}: FieldRendererProps) {
  const label = field.label ?? name;

  switch (field.type) {
    case 'text':
    case 'email':
      return (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">{label}</label>
          <input
            type={field.type}
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
      );

    case 'textarea':
      return (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">{label}</label>
          <textarea
            value={(value as string) ?? ''}
            rows={4}
            onChange={(e) => onChange(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-y"
          />
        </div>
      );

    case 'boolean':
      return (
        <div className="flex items-center gap-2">
          <input
            id={`field-${name}`}
            type="checkbox"
            checked={(value as boolean) ?? false}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor={`field-${name}`}
            className="text-sm font-medium text-slate-700"
          >
            {label}
          </label>
        </div>
      );

    case 'list': {
      const list = (value as string[]) ?? [];
      return (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">{label}</label>
          {list.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const next = [...list];
                  next[idx] = e.target.value;
                  onChange(next);
                }}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  const next = list.filter((_, i) => i !== idx);
                  onChange(next);
                }}
              >
                ✕
              </Button>
            </div>
          ))}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onChange([...list, ''])}
          >
            + Agregar
          </Button>
        </div>
      );
    }

    case 'array': {
      const items = (value as Record<string, unknown>[]) ?? [];
      const itemSchema = field.itemSchema ?? {};
      return (
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-slate-700">{label}</label>
          {items.map((item, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Item {idx + 1}
                </span>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    const next = items.filter((_, i) => i !== idx);
                    onChange(next);
                  }}
                >
                  Eliminar
                </Button>
              </div>
              {Object.entries(itemSchema).map(([fieldName, subField]) => (
                <FieldRenderer
                  key={fieldName}
                  name={fieldName}
                  field={subField}
                  value={item[fieldName]}
                  onChange={(v) => {
                    const next = [...items];
                    next[idx] = { ...item, [fieldName]: v };
                    onChange(next);
                  }}
                />
              ))}
            </div>
          ))}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const blank: Record<string, unknown> = {};
              Object.keys(itemSchema).forEach((k) => {
                blank[k] = '';
              });
              onChange([...items, blank]);
            }}
          >
            + Agregar item
          </Button>
        </div>
      );
    }

    case 'object': {
      const obj = (value as Record<string, unknown>) ?? {};
      const fields = field.fields ?? {};
      return (
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-slate-700">{label}</label>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 flex flex-col gap-3">
            {Object.entries(fields).map(([fieldName, subField]) => (
              <FieldRenderer
                key={fieldName}
                name={fieldName}
                field={subField}
                value={obj[fieldName]}
                onChange={(v) => onChange({ ...obj, [fieldName]: v })}
              />
            ))}
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}
