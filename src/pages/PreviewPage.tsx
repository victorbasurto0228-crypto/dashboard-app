import { useSearchParams } from 'react-router-dom';
import { Preview } from '../components/Preview';

export function PreviewPage() {
  const [searchParams] = useSearchParams();
  const tenant = searchParams.get('tenant') ?? '';

  return (
    <div className="flex h-full flex-col gap-4">
      <h1 className="text-xl font-bold text-slate-800">Preview</h1>
      <div className="flex-1" style={{ minHeight: '70vh' }}>
        <Preview tenant={tenant} />
      </div>
    </div>
  );
}
