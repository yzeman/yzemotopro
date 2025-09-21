import type { Config } from '@react-router/dev/config';

export default {
  appDirectory: './src/app',
  ssr: false, // ← MUST be false for SPA
  prerender: false,
  // Explicit SPA settings:
  assetsBuildDirectory: 'dist/client',
  browserBuildDirectory: 'dist/client', 
  publicPath: '/',
  serverBuildFile: undefined, // ← Disable server build
} satisfies Config;
