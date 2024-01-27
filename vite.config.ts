import { defineConfig } from 'vite';
import path from 'path';
import dts from 'vite-plugin-dts';
//import DynamicPublicDirectory from 'vite-multiple-assets';
//

export default defineConfig({
	plugins: [
		dts({
			outDir: 'dist/types',
			include: ['src'],
			exclude: ['src/repl', 'src/test']
			//rollupTypes: true,
		}),
		//		DynamicPublicDirectory(['./public', './docs/'])
	],
	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/main.ts'),
			name: 'garfunkel',
			fileName: (format) => `garfunkel.${format}.js`,
		},
		rollupOptions: {
			input: {
				garfunkel: path.resolve(__dirname, 'src/main.ts'),
			},
			output: [
				{
					format: 'es',
					entryFileNames: '[name].[format].js',
				},
				{
					format: 'umd',
					name: 'Garfunkel',
					entryFileNames: '[name].[format].js',
				},
			],
		},
	},
	test: {
		exclude: ['ideas/**/*', '**/node_modules/**', '**/dist/**'],
	},
});
