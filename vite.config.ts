import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './src/test/setup.ts',
		poolOptions: {
			forks: {
				execArgv: ['--no-warnings'],
			},
		},
	},
	resolve: {
		alias: {
			'@pages': path.resolve(__dirname, './src/v-pages'),
			'@/pages': path.resolve(__dirname, './src/v-pages'),
			'@': path.resolve(__dirname, './src'),
			'@components': path.resolve(__dirname, './src/components'),
			'@features': path.resolve(__dirname, './src/components/features'),
			'@store': path.resolve(__dirname, './src/store'),
			'@utils': path.resolve(__dirname, './src/utils'),
			'@hooks': path.resolve(__dirname, './src/hooks'),
			'@types': path.resolve(__dirname, './src/types'),
		},
	},
	server: {
		proxy: {
			'/api': {
				target: 'http://13.55.7.237:3000',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ''),
			},
		},
	},
	build: {
		chunkSizeWarningLimit: 1600,
	},
});
