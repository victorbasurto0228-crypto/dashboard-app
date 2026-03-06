// TypeScript types for tenant, schema, content, etc.

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  template: string;
  theme: Theme;
  content: Record<string, unknown>;
}

export interface Theme {
  primary: string;
  secondary: string;
  accent: string;
}

export interface User {
  email: string;
  role: string;
  tenant: string;
}

export interface TemplateInfo {
  name: string;
  description: string;
  sections: string[];
  schema: Record<string, SchemaField>;
}

export interface SchemaField {
  type: 'text' | 'textarea' | 'email' | 'boolean' | 'list' | 'array' | 'object';
  label?: string;
  fields?: Record<string, SchemaField>;
  itemSchema?: Record<string, SchemaField>;
}

export interface TenantListItem {
  id: string;
  name: string;
  subdomain: string;
  template: string;
}
