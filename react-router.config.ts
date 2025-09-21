import type { Config } from '@react-router/dev/config';

export default {
  appDirectory: './src/app',
  ssr: true, // ← Enable SSR
  assetsBuildDirectory: 'build/client',
  serverBuildDirectory: 'build/server',
  publicPath: '/',
} satisfies Config;
