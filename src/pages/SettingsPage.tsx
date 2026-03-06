import { useSearchParams } from 'react-router-dom';
import { Card } from '../components/common/Card';

export function SettingsPage() {
  const [searchParams] = useSearchParams();
  const tenant = searchParams.get('tenant') ?? '';

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-slate-800">Configuración</h1>
      <Card>
        <p className="text-slate-500 text-sm">
          Configuración del tenant <strong>{tenant}</strong> — próximamente.
        </p>
      </Card>
    </div>
  );
}
