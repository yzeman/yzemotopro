import type { Config } from '@react-router/dev/config';

export default {
  appDirectory: './src/app',
  ssr: false,
  // Add browser build output explicitly
  assetsBuildDirectory: 'dist/client',
  browserBuildDirectory: 'dist/client',
  publicPath: '/',
  prerender: [],
} satisfies Config;
