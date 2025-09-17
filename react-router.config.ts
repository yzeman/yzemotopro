import type { Config } from '@react-router/dev/config';

export default {
    appDirectory: './src/app',
    ssr: false, // ← Change this to FALSE
    prerender: [],
} satisfies Config;
