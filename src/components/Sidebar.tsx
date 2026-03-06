import { NavLink, useNavigate } from 'react-router-dom';
import { apiPost } from '../lib/api';
import { withTenant } from '../lib/tenant';

interface SidebarProps {
  tenant: string;
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { label: 'Editor de Contenido', icon: '📄', path: '/editor' },
  { label: 'Preview', icon: '👁️', path: '/preview' },
  { label: 'Configuración', icon: '⚙️', path: '/settings' },
];

export function Sidebar({ tenant, open, onClose }: SidebarProps) {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await apiPost('/api/auth/logout', {});
    } catch {
      // ignore
    }
    navigate(withTenant('/login', tenant));
  }

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-slate-900 text-slate-100 transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo / Brand */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-700">
          <span className="text-lg font-bold tracking-wide text-white">
            🏢 {tenant || 'Dashboard'}
          </span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white lg:hidden"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={withTenant(item.path, tenant)}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  <span>{item.icon}</span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="border-t border-slate-700 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <span>🚪</span>
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
}
