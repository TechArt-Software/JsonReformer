import { defineConfig } from 'tsup';

export default defineConfig({
    entryPoints: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    minify: true,
    sourcemap: true,
    external: ['fs', 'path'],
    ignoreWatch: ['**/dist', '**/node_modules'],
});