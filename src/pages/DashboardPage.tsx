import { useEffect, useState } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { apiGet } from '../lib/api';
import type { User } from '../types';

export function DashboardPage() {
  const [searchParams] = useSearchParams();
  const tenant = searchParams.get('tenant') ?? '';

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    apiGet<User>('/api/auth/me')
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <Sidebar
        tenant={tenant}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Hamburger for mobile */}
            <button
              className="rounded p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
            <span className="font-semibold text-slate-800">
              {tenant || 'Dashboard'}
            </span>
          </div>
          {user && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>👤</span>
              <span>{user.email}</span>
              {user.role && (
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                  {user.role}
                </span>
              )}
            </div>
          )}
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet context={{ tenant }} />
        </main>
      </div>
    </div>
  );
}
