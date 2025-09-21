import type { Config } from '@react-router/dev/config';

export default {
  appDirectory: './src/app',
  ssr: false, // SPA mode
  // Explicit SPA build directories
  assetsBuildDirectory: 'dist/client',
  browserBuildDirectory: 'dist/client',
  publicPath: '/',
  // No prerendering for SPA
  prerender: false,
  // Server build not needed for SPA
  serverBuildFile: undefined,
  serverBuildDirectory: undefined,
} satisfies Config;
