import { defineConfig } from 'vite';
import path from 'path';
import dts from 'vite-plugin-dts';
//import DynamicPublicDirectory from 'vite-multiple-assets';

export default defineConfig({
	base: '/garfunkel',
	plugins: [
//		DynamicPublicDirectory(['./public', './docs/'])
	],
	server: {
		port: 5174
	},
	build: {
		outDir: "./dist-pg/",
		rollupOptions: {
			input: {
				playground: path.resolve(__dirname, 'playground.html'),
			},
		},
	},
})
