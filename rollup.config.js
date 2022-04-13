import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';
import typescript from '@rollup/plugin-typescript';
import sveltePreprocess from 'svelte-preprocess';

const production = !process.env.ROLLUP_WATCH;

export default {
  external: ['moment'],
  input: 'src/main.ts',
  output: {
    sourcemap: !production,
    format: 'amd',
    name: 'widget',
    file: production ? 'dist/script.js' : 'dist/widget.js',
  },
  plugins: [
    svelte({
      emitCss: false,
      preprocess: sveltePreprocess({
        sourceMap: !production
      }),
      compilerOptions: {
        dev: !production,
      }
    }),
    commonjs(),
    resolve({
      browser: true,
      dedupe: (importee) =>
          importee === 'svelte' || importee.startsWith('svelte/'),
    }),
    typescript({
      sourceMap: !production
    }),
    production && terser({
      compress: {
        drop_console: true,
      }
    }),
    !production &&
    serve({
      verbose: true,
      contentBase: '',
      historyApiFallback: false,
      host: 'localhost',
      port: 5503,
      https: false,
    }),
  ],
  watch: {
    clearScreen: false,
  },
};
