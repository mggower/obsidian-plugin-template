import { defineConfig, loadEnv } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { resolve } from 'path'

// 1. Fix: __dirname is not available in ESM (Vite).
// We replicate it using standard node:url imports.
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isProd = mode === 'production'

  const outDir = env.OBSIDIAN_PATH || resolve(__dirname, 'dist')

  return {
    plugins: [
      viteStaticCopy({
        targets: [
          {
            src: 'manifest.json',
            dest: '.',
          },
          {
            src: 'src/styles.css',
            dest: '.',
          },
        ],
      }),
    ],
    build: {
      outDir,
      target: 'ES2022',
      minify: isProd,

      // 3. Improvement: Inline source maps work best in Obsidian's dev console
      sourcemap: isProd ? false : 'inline',

      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'Obsidian NFL Stats Plugin',
        fileName: () => 'main.js',
        formats: ['cjs'],
      },
      rollupOptions: {
        // 4. Critical: Externalize Node built-ins (fs, path, etc.)
        // Obsidian provides these at runtime via Electron.
        external: [
          'obsidian',
          'electron',
          'fs',
          'path',
          'url',
          'crypto',
          '@codemirror/view', // Common dependencies in Obsidian
          '@codemirror/state',
        ],
        output: {
          // Removes code that might cause confusion in the bundle
          exports: 'named',
        },
        watch: {
          include: 'src/**',
        },
      },
    },
  }
})
