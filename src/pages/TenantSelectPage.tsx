import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../lib/api';
import { withTenant } from '../lib/tenant';
import type { TenantListItem } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Card } from '../components/common/Card';

export function TenantSelectPage() {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState<TenantListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGet<TenantListItem[]>('/api/tenants')
      .then(setTenants)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Error al cargar tenants'),
      )
      .finally(() => setLoading(false));
  }, []);

  function selectTenant(id: string) {
    navigate(withTenant('/login', id));
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-lg">
        <Card title="Seleccionar Tenant">
          {loading && (
            <div className="py-8">
              <LoadingSpinner />
            </div>
          )}
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          {!loading && !error && tenants.length === 0 && (
            <p className="text-sm text-slate-500">No se encontraron tenants.</p>
          )}
          <ul className="flex flex-col gap-2">
            {tenants.map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => selectTenant(t.id)}
                  className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm transition hover:bg-blue-50 hover:border-blue-300"
                >
                  <span className="font-medium text-slate-800">{t.name}</span>
                  <span className="text-slate-500 text-xs">{t.subdomain}</span>
                </button>
              </li>
            ))}
          </ul>
          {/* Manual input for dev */}
          <form
            className="mt-6 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const input = (e.currentTarget.elements.namedItem('tenantId') as HTMLInputElement).value.trim();
              if (input) selectTenant(input);
            }}
          >
            <input
              name="tenantId"
              placeholder="Ingresar tenant ID..."
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
            >
              Ir
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}
