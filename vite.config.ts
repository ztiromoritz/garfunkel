import { defineConfig, mergeConfig } from 'vite';
import path from 'path';
import dts from 'vite-plugin-dts';
import { defineConfig as defineVitest, configDefaults } from 'vitest/config';
//import DynamicPublicDirectory from 'vite-multiple-assets';
//

const viteConfig = defineConfig({
	plugins: [
		dts({
			outDir: 'dist/types',
			include: ['src'],
			exclude: ['src/repl', 'src/test'],
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
});

const vitestConfig = defineVitest({
	test: {
		exclude: [
			'**/ideas/**/*',
			'**/node_modules/**',
			'**/dist/**',
			'**/dist-*/**',
			'**/docs/**',
		],
		coverage: {
			provider: 'v8',
			
			exclude: [ ...configDefaults.coverage.exclude, '**/scripts/**', '**/dist-*/**', '**/ideas/**', '**/docs/**', '**/src/test/**'],
		},
	},
});

export default mergeConfig(viteConfig, vitestConfig);
