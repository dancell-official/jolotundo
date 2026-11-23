// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

const siteUrl = process.env.SITE_URL || 'https://jolotundoglamping.com';

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: true
    }
  }
});
