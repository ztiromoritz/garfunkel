import { defineConfig } from 'vite';
import path from 'path';
import dts from 'vite-plugin-dts';
import DynamicPublicDirectory from 'vite-multiple-assets';

export default defineConfig({
	plugins: [dts(), DynamicPublicDirectory(['/public', '/docs'])],
	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/main.ts'),
			name: 'garfunkel',
			fileName: (format) => `garfunkel.${format}.js`,
		},
		rollupOptions: {
			input: { 
				main: path.resolve(__dirname, 'index.html'),
				playground: path.resolve(__dirname, 'playground.html'),
			},
		},
	},
	test: {
		exclude: ['ideas/**/*', '**/node_modules/**', '**/dist/**'],
	},
});
