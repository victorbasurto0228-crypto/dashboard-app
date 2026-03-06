import { useRef, useState } from 'react';
import { Button } from './common/Button';

interface PreviewProps {
  tenant: string;
  autoReload?: boolean;
}

type ViewportSize = 'mobile' | 'tablet' | 'desktop';

const viewports: Record<ViewportSize, { label: string; icon: string; width: string }> = {
  mobile: { label: 'Mobile', icon: '📱', width: '375px' },
  tablet: { label: 'Tablet', icon: '📱', width: '768px' },
  desktop: { label: 'Desktop', icon: '🖥️', width: '100%' },
};

export function Preview({ tenant }: PreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [viewport, setViewport] = useState<ViewportSize>('desktop');

  const src = `http://localhost:4321${tenant ? `?tenant=${tenant}` : ''}`;

  function reload() {
    if (iframeRef.current) {
      iframeRef.current.src = src;
    }
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-2 shadow-sm">
        <div className="flex items-center gap-2">
          {(Object.keys(viewports) as ViewportSize[]).map((v) => (
            <Button
              key={v}
              variant={viewport === v ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewport(v)}
            >
              {viewports[v].icon} {viewports[v].label}
            </Button>
          ))}
        </div>
        <Button variant="secondary" size="sm" onClick={reload}>
          🔄 Recargar
        </Button>
      </div>

      {/* iframe container */}
      <div className="flex flex-1 items-start justify-center overflow-auto rounded-xl border border-slate-200 bg-slate-100 p-4">
        <iframe
          ref={iframeRef}
          src={src}
          title="Landing Preview"
          style={{ width: viewports[viewport].width, minHeight: '600px' }}
          className="rounded-lg bg-white shadow-md transition-all duration-300"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </div>
    </div>
  );
}
