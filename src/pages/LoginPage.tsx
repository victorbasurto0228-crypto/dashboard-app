import { FormEvent, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiPost } from '../lib/api';
import { withTenant } from '../lib/tenant';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

export function LoginPage() {
  const [searchParams] = useSearchParams();
  const tenant = searchParams.get('tenant') ?? '';
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await apiPost('/api/auth/login', { email, password, tenant });
      navigate(withTenant('/dashboard', tenant));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error de autenticación',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md">
        {tenant && (
          <p className="mb-4 text-center text-sm text-slate-500">
            Accediendo al tenant:{' '}
            <span className="font-semibold text-slate-700">{tenant}</span>
          </p>
        )}
        <Card title="Iniciar Sesión">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}
            <Button type="submit" disabled={loading} className="w-full mt-2">
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
