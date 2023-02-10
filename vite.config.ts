import { defineConfig } from 'vite';
import path from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: 'garfunkel',
      fileName: (format) => `garfunkel.${format}.js`,
    },
  },
  test: {
    exclude: ['ideas/**/*', '**/node_modules/**', '**/dist/**'],
  },
});
