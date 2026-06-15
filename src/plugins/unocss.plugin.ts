/**
 * omniui — Lightweight UI Framework
 * Built with Preact & UnoCSS | @omnidev
 */

import type { BunPlugin } from 'bun';
import { join } from 'node:path';
import { transform } from 'lightningcss';
import { createGenerator } from '@unocss/core';

async function getConfig() {
  const configPath = join(process.cwd(), 'uno.config.ts');

  try {
    const mod = await import(configPath);
    return mod.default || mod;
  } catch { return {}; }
}

const config = await getConfig();
const generator = await createGenerator(config);
let cache: Promise<string> | null = null;

function compile() {
  if (cache) return cache; cache = (async () => {
    const globs = [
      new Bun.Glob('app/**/*.{html,tsx,jsx,js,ts}'),
      new Bun.Glob('public/components/**/*.{html,tsx,jsx,js,ts}')
    ];

    let sources = '';
    for (const glob of globs) {
      for await (const file of glob.scan())
        sources += await Bun.file(file).text() + '\n';
    }

    const { css } = await generator.generate(sources);
    setTimeout(() => { cache = null }, 50); return css || '';
  })(); return cache;
}

function minify(str: string) { return str
  .split('\n').map(line => line.trim())
  .filter(Boolean).join('')
}

export const plugin: BunPlugin = {
  name: 'bun-plugin-unocss', async setup(build) {
    const isDev = !build.config?.minify;

    build.onResolve({ filter: /^virtual:uno\.css/ }, (args) => {
      return { path: args.path, namespace: 'unocss' };
    });

    build.onLoad({ filter: /.*/, namespace: 'unocss' }, async () => {
      const css = transform({
        filename: 'virtual:uno.css', minify: !isDev,
        code: new Uint8Array(Buffer.from( await compile() )),
      })?.code?.toString() || '';

      return { contents: minify(`
if (typeof document !== 'undefined') {
  const css = ${JSON.stringify(css)};

  if (document.adoptedStyleSheets) {
    let sheet = window.__unocss;

    if (!sheet) {
      sheet = new CSSStyleSheet(); window.__unocss = sheet;
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
    }

    if (sheet.__css !== css) {
      sheet.replaceSync(css);
      sheet.__css = css;
    }
  } else {
    let style = document.getElementById('unocss');

    if (!style) {
      style = document.createElement('style');
      style.id = 'unocss'; document.head.appendChild(style);
    }

    if (style.textContent !== css) {
      style.textContent = css;
    }
  }
}
      `.trim()), loader: 'js' };
    });

    isDev && build.onLoad({ filter: /\.(tsx|jsx)$/ }, async (args) => {
      const content = await Bun.file(args.path).text();
      const nocache = `\nimport "virtual:uno.css";`;

      return {
        contents: content + nocache, loader: args.path
          .endsWith('.tsx') ? 'tsx' : 'jsx' // no-cache
      };
    });
  }
}

export default plugin;