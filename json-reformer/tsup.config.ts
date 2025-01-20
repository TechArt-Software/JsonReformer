import { defineConfig } from 'tsup';
import { execSync } from 'child_process';

export default defineConfig({
    entryPoints: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    minify: true,
    sourcemap: true,
    external: ['fs', 'path'],
    ignoreWatch: ['**/dist', '**/node_modules'],
    onSuccess: () => {
        return execSync('cp index.html dist/');
    }
});