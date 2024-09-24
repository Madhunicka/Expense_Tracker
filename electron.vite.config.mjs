import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      react(),
      viteStaticCopy({
        targets: [
          {
            src: 'src/preload/*.js',
            dest: 'out/preload'
          },
          {
            src: 'src/renderer/popup.html',
            dest: '' // You may want to specify a destination if necessary
          }
        ]
      })
    ]
  }
});
