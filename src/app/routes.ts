export default [
  index('./page.jsx'),
  route('admin', './admin/page.jsx'),
  route('vehicles/:id', './vehicles/[id]/page.jsx'),
  route('api/auth/*', './api/auth/route.ts'),
  // REMOVE THIS LINE ↓ (old Vercel API route)
  // route('api/vehicles', './api/vehicles/route.js'),
  route('*', './__create/not-found.tsx'),
];
