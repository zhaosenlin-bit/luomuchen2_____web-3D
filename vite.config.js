import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'

// Plugin: ensure HTML responses declare charset=utf-8 so Chinese characters render correctly
const charsetPlugin = () => ({
  name: 'charset-html',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const origSetHeader = res.setHeader.bind(res);
      res.setHeader = function (name, value) {
        if (typeof name === 'string' && name.toLowerCase() === 'content-type' && typeof value === 'string' && value.startsWith('text/html')) {
          if (!/charset/i.test(value)) value = value + '; charset=utf-8';
        }
        return origSetHeader(name, value);
      };
      next();
    });
  },
});

// https://vite.dev/config/
export default defineConfig({
  base: '/luomuchen2_____web-3D/',
  build: {
    outDir: 'dist/cartoon',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          return id.includes('node_modules') ? 'vendor' : undefined;
        },
      },
    },
  },
  plugins: [react(), viteCompression(), charsetPlugin()],
})
