import type { Config } from '@react-router/dev/config';

export default {
	appDirectory: './src/app',
	ssr: false,
	prerender: [], // ← CHANGED FROM ['/*?'] TO []
} satisfies Config;
