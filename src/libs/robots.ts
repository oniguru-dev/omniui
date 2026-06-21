/**
 * omniui — Lightweight UI Framework
 * Built with Preact & UnoCSS | @omnidev
 */

import { join } from 'path';

type RobotsConfig = {
  baseUrl?: string;
  robots?: {
    disallow?: string[];
    crawler?: number;
  };
};

export async function newRobots(config: RobotsConfig, output: string) {
  console.log('🕹 Generating robots.txt...');
  if (!config?.baseUrl) {
    console.error('❌ baseUrl is required in omniui.config.ts for robots.txt generation!');
    console.error('   Add: baseUrl: "https://your-domain.com" to your config');
    throw new Error('Missing baseUrl in config - robots.txt generation failed');
  }

  const baseUrl = config.baseUrl.replace(/\/$/, '');

  let robots = `
# Auto-Generated - robots.txt
User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml
  `.trim();

  if (config?.robots?.disallow?.length) {
    robots += '\n# Custom Disallow Rules\n'
    config.robots.disallow.forEach(path => {
      robots += `Disallow: ${path}\n`
    });
  }

  if (config?.robots?.crawler && typeof config.robots.crawler === 'number') {
    robots += `\nCrawl-delay: ${config.robots.crawler}\n`
  }

  const path = join(output, 'robots.txt');
  await Bun.write(path, robots);
  return { path, content: robots };
}