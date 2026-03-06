# dashboard-app — Panel de Administración (ss-panel)

Dashboard de administración para el SaaS multi-tenant de Landing Pages.

## Stack

- React 19 + Vite + TypeScript
- Tailwind CSS 4
- Puerto: `5173`

## Requisitos

- Node.js 18+
- `core-api` (.NET 8) corriendo en `http://localhost:5000`
- `landing-engine` (Astro SSR) corriendo en `http://localhost:4321`

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en el navegador.

## Build de producción

```bash
npm run build
```

## Uso

### Flujo principal

1. Acceder a `http://localhost:5173?tenant=sender-solution`
2. Se redirige automáticamente a `/login?tenant=sender-solution`
3. Hacer login con las credenciales del tenant (ej: `admin@sendersolution.com` / `admin123`)
4. El dashboard muestra la sidebar con:
   - 📄 **Editor de Contenido** — formularios dinámicos generados desde el schema del template
   - 👁️ **Preview** — iframe de la landing con controles responsive (Mobile / Tablet / Desktop)
   - ⚙️ **Configuración** — placeholder
   - 🚪 **Cerrar Sesión**

### Sin tenant

Si se accede sin `?tenant=X`, se muestra la página de selección de tenant (`/tenant-select`) para desarrollo.

## Proxy de Vite

El proxy está configurado en `vite.config.ts` para redirigir `/api/*` a `http://localhost:5000`. Esto permite que las cookies HttpOnly funcionen correctamente.

## Estructura de archivos

```
src/
├── main.tsx
├── index.css              # Tailwind 4 imports
├── App.tsx                # Router con BrowserRouter
├── lib/
│   ├── api.ts             # fetch wrapper (credentials: include, X-Tenant-Id header)
│   └── tenant.ts          # utilidades para resolver tenant desde URL
├── pages/
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── EditorPage.tsx
│   ├── PreviewPage.tsx
│   ├── SettingsPage.tsx
│   └── TenantSelectPage.tsx
├── components/
│   ├── Sidebar.tsx
│   ├── Preview.tsx
│   ├── FieldRenderer.tsx
│   ├── SectionEditor.tsx
│   └── common/
│       ├── Input.tsx
│       ├── Button.tsx
│       ├── Card.tsx
│       └── LoadingSpinner.tsx
└── types/
    └── index.ts
```