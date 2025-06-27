import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import netlify from '@astrojs/netlify';

export default defineConfig({
  integrations: [tailwind()],
  output: 'server',
  adapter: netlify({
    edgeMiddleware: true
  }),
  server: {
    port: 4321
  },
  vite: {
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }
  }
});