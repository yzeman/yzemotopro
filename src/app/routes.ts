import { index, route } from '@react-router/dev/routes';

export default [
  // Your main pages
  index('./page.jsx'),
  route('admin', './admin/page.jsx'),
  route('vehicles/:id', './vehicles/[id]/page.jsx'),
  
  // API routes (if needed)
  route('api/auth/*', './api/auth/route.ts'),
  route('api/vehicles/*', './api/vehicles/route.js'),
  route('api/utils/*', './api/utils/route.ts'),
  
  // Catch-all route
  route('*', './__create/not-found.tsx'),
];
