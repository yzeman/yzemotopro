import type { Config } from '@react-router/dev/config';

export default {
  appDirectory: './src/app',
  ssr: false, // ← EXPLICITLY disable server-side rendering
  prerender: false,
  // Add these for SPA mode:
  assetsBuildDirectory: 'dist/client',
  browserBuildDirectory: 'dist/client',
  publicPath: '/',
} satisfies Config;
