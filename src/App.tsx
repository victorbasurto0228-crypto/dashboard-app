import { useEffect } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useSearchParams,
} from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { EditorPage } from './pages/EditorPage';
import { PreviewPage } from './pages/PreviewPage';
import { TenantSelectPage } from './pages/TenantSelectPage';
import { SettingsPage } from './pages/SettingsPage';

// Redirect root to /login or /tenant-select depending on ?tenant=X
function RootRedirect() {
  const [searchParams] = useSearchParams();
  const tenant = searchParams.get('tenant');

  if (tenant) {
    return <Navigate to={`/login?tenant=${tenant}`} replace />;
  }
  return <Navigate to="/tenant-select" replace />;
}

// Redirect /dashboard root to /editor preserving tenant query param
function DashboardDefaultRedirect() {
  const [searchParams] = useSearchParams();
  const tenant = searchParams.get('tenant');
  const suffix = tenant ? `?tenant=${tenant}` : '';
  return <Navigate to={`/editor${suffix}`} replace />;
}

function AppRoutes() {
  const [searchParams] = useSearchParams();
  const tenant = searchParams.get('tenant');

  // Update document title when tenant changes
  useEffect(() => {
    if (tenant) {
      document.title = `${tenant} | Dashboard Admin`;
    }
  }, [tenant]);

  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/tenant-select" element={<TenantSelectPage />} />

      {/* Dashboard layout with nested routes */}
      <Route path="/dashboard" element={<DashboardPage />}>
        <Route index element={<DashboardDefaultRedirect />} />
      </Route>
      <Route path="/editor" element={<DashboardPage />}>
        <Route index element={<EditorPage />} />
      </Route>
      <Route path="/preview" element={<DashboardPage />}>
        <Route index element={<PreviewPage />} />
      </Route>
      <Route path="/settings" element={<DashboardPage />}>
        <Route index element={<SettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
