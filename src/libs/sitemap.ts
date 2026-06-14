/**
 * omniui — Lightweight UI Framework
 * Built with Preact & UnoCSS | @omnidev
 */

import { join } from 'path';

type RouteInput = {
  type: string;
  route: string
};

type SitemapEntry = {
  route: string;
  lastmod: string;
  priority: number
};

function getPriority(route: string) {
  if (route === '/') return 1.0;
  if (route.includes(':')) return 0.6;

  const depth = route.split('/')
    .filter(Boolean).length

  if (depth === 1) return 0.8;
  if (depth === 2) return 0.7;

  return 0.6;
}

export async function newSitemap(
  config: {
    baseUrl?: string,
    disallow?: string[],
    ignore?: string[]
  } | undefined,
  output: string,
  routes: RouteInput[]
): Promise<{ routes: SitemapEntry[]; path: string }> {
  console.log('🗺️ Generating sitemap.xml...');

  if (!config?.baseUrl) {
    console.error('❌ baseUrl is required in bertui.config.js for sitemap generation!');
    console.error('   Add: baseUrl: "https://your-domain.com" to your config');
    throw new Error('Missing baseUrl in config - sitemap generation failed');
  }

  const baseUrl = config.baseUrl
    .replace(/\/$/, '');

  const statics = routes.filter(route => (
    route.type === 'static' &&
    !(config.ignore ?? []).includes(route.route)
  ));

  const now = new Date().toISOString()
    .split('T')[0] ?? '';

  const sitemap = statics.map(route => ({
    route: route.route, lastmod: now,
    priority: getPriority(route.route)
  }));

  const urlset = sitemap.map(route => `
<url>
  <loc>${baseUrl}${route.route}</loc>
  <lastmod>${route.lastmod}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>${route.priority}</priority>
</url>
  `.trim()).join('\n');

  const xml = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>
  `.trim();

  const path = join(output, 'sitemap.xml');
  await Bun.write(path, xml);
  return { routes: sitemap, path };
}