import { type RouteConfig } from '@react-router/dev/routes';

export default [
  {
    path: '/',
    component: './routes/_index.tsx',
  },
  {
    path: 'admin',
    component: './admin/page.jsx',
  },
  {
    path: 'vehicles/:id',
    component: './vehicles/[id]/page.jsx',
  },
  {
    path: 'api/auth/*',
    component: './api/auth/route.ts',
  },
  {
    path: '*',
    component: './__create/not-found.tsx',
  }
] satisfies RouteConfig;
