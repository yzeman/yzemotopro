import type { Config } from '@react-router/dev/config';

export default {
  appDirectory: './src/app',
  ssr: false,
  assetsBuildDirectory: 'dist/client',
  browserBuildDirectory: 'dist/client',
  publicPath: '/',
  prerender: false,
} satisfies Config;
