import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiGet, apiPut } from '../lib/api';
import { SectionEditor } from '../components/SectionEditor';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import type { SchemaField, TemplateInfo } from '../types';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface TenantConfig {
  template: string;
  [key: string]: unknown;
}

export function EditorPage() {
  const [searchParams] = useSearchParams();
  const tenant = searchParams.get('tenant') ?? '';

  const [schema, setSchema] = useState<Record<string, Record<string, SchemaField>>>({});
  const [content, setContent] = useState<Record<string, Record<string, unknown>>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError('');
      try {
        const config = await apiGet<TenantConfig>(`/api/tenant/config?tenant=${tenant}`);
        const templateId = config.template;

        const [templateInfo, tenantContent] = await Promise.all([
          apiGet<TemplateInfo>(`/api/templates/${templateId}/schema`),
          apiGet<Record<string, Record<string, unknown>>>(`/api/tenant/content?tenant=${tenant}`),
        ]);

        // Organise schema by section
        const bySection: Record<string, Record<string, SchemaField>> = {};
        if (templateInfo.sections && templateInfo.schema) {
          for (const section of templateInfo.sections) {
            const sectionSchema: Record<string, SchemaField> = {};
            Object.entries(templateInfo.schema).forEach(([key, field]) => {
              if (key.startsWith(`${section}.`)) {
                sectionSchema[key.slice(section.length + 1)] = field;
              } else if (!key.includes('.')) {
                // top-level field goes to a generic section
                bySection['general'] = bySection['general'] ?? {};
                bySection['general'][key] = field;
              }
            });
            if (Object.keys(sectionSchema).length > 0) {
              bySection[section] = sectionSchema;
            }
          }

          // If no sections matched, show all schema fields in one group
          if (Object.keys(bySection).length === 0) {
            bySection['content'] = templateInfo.schema as Record<string, SchemaField>;
          }
        }

        setSchema(bySection);
        setContent(tenantContent ?? {});
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el editor');
      } finally {
        setLoading(false);
      }
    }

    if (tenant) loadData();
  }, [tenant]);

  const saveContent = useCallback(
    async (data: Record<string, Record<string, unknown>>) => {
      setSaveStatus('saving');
      try {
        await apiPut(`/api/tenant/content?tenant=${tenant}`, data);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch {
        setSaveStatus('error');
      }
    },
    [tenant],
  );

  function handleFieldChange(section: string, field: string, value: unknown) {
    const next = {
      ...content,
      [section]: { ...(content[section] ?? {}), [field]: value },
    };
    setContent(next);

    // Debounce auto-save (2s)
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      saveContent(next);
    }, 2000);
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner message="Cargando editor..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 p-6 text-red-700">
        <p className="font-semibold">Error al cargar el editor</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Save status indicator */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">Editor de Contenido</h1>
        <div className="text-sm">
          {saveStatus === 'saving' && (
            <span className="text-blue-600">💾 Guardando...</span>
          )}
          {saveStatus === 'saved' && (
            <span className="text-green-600">✓ Guardado</span>
          )}
          {saveStatus === 'error' && (
            <span className="text-red-600">✗ Error al guardar</span>
          )}
        </div>
      </div>

      {Object.entries(schema).map(([section, sectionSchema]) => (
        <SectionEditor
          key={section}
          section={section}
          schema={sectionSchema}
          values={content[section] ?? {}}
          onChange={handleFieldChange}
        />
      ))}

      {Object.keys(schema).length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500">
          No se encontró schema para este tenant.
        </div>
      )}
    </div>
  );
}
