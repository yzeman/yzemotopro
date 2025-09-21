import { type RouteConfig } from '@react-router/dev/routes';

export default [
  {
    path: '/',
    file: './routes/_index.tsx',
  },
  {
    path: 'admin',
    file: './admin/page.jsx',
  },
  {
    path: 'vehicles/:id',
    file: './vehicles/[id]/page.jsx',
  },
  {
    path: 'api/auth/*',
    file: './api/auth/route.ts',
  },
  {
    path: '*',
    file: './__create/not-found.tsx',
  }
] satisfies RouteConfig;
