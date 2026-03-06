// Resolve tenant ID from the URL query param ?tenant=X
export function getTenantFromUrl(): string {
  const params = new URLSearchParams(window.location.search);
  return params.get('tenant') ?? '';
}

// Append (or update) the ?tenant=X query param to a path
export function withTenant(path: string, tenant: string): string {
  if (!tenant) return path;
  const [base, existing] = path.split('?');
  const params = new URLSearchParams(existing ?? '');
  params.set('tenant', tenant);
  return `${base}?${params.toString()}`;
}
