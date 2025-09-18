import {
  type RouteConfigEntry,
  index,
  route,
} from '@react-router/dev/routes';

export default [
  index('./page.jsx'),
  route('admin', './admin/page.jsx'),
  route('vehicles/:id', './vehicles/[id]/page.jsx'),
  route('api/auth/*', './api/auth/route.ts'),
  route('api/vehicles', './api/vehicles/route.js'), // ← CHANGED THIS LINE
  route('*', './__create/not-found.tsx'),
];
