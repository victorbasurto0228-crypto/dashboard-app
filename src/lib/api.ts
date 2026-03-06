import { getTenantFromUrl, withTenant } from './tenant';

const BASE = '';

function redirectToLogin() {
  const tenant = getTenantFromUrl();
  window.location.href = withTenant('/login', tenant);
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const tenant = getTenantFromUrl();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (tenant) {
    headers['X-Tenant-Id'] = tenant;
  }

  if (options.body) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers,
  });

  if (res.status === 401) {
    redirectToLogin();
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  const contentType = res.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return res.json() as Promise<T>;
  }

  return undefined as T;
}

export function apiGet<T>(path: string): Promise<T> {
  return request<T>(path);
}

export function apiPost<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function apiPut<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}
