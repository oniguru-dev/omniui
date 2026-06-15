/**
 * omniui — Lightweight UI Framework
 * Built with Preact & UnoCSS | @omnidev
 */

import type { BunPlugin } from 'bun';
import { transform } from 'lightningcss';
import { createGenerator } from '@unocss/core';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';
import { defineConfig } from 'unocss';
import { presetWind4, presetIcons, presetTypography } from 'unocss';

function loadUnoConfig() {
  const configPath = join(process.cwd(), 'uno.config.ts');
  if (!existsSync(configPath)) {
    return defineConfig({
      presets: [presetWind4(), presetIcons(), presetTypography()],
      theme: { colors: { accent: "#8040ff" } },
    });
  }
  // Default config - user should configure their own
  return defineConfig({
    presets: [presetWind4(), presetIcons(), presetTypography()],
    theme: { colors: { accent: "#8040ff" } },
  });
}

const generator = await createGenerator(loadUnoConfig());

const generator = await createGenerator(unocfg);
let cache: Promise<string> | null = null;

function process() {
  if (cache) return cache; cache = (async () => {
    const appDir = join(process.cwd(), 'app');
    const pubDir = join(process.cwd(), 'public/components');
    const globs = [
      new Bun.Glob('**/*.{html,tsx,jsx,js,ts}'),
      new Bun.Glob('**/*.{html,tsx,jsx,js,ts}')
    ];

    let sources = '';
    for (const [glob, dir] of [[globs[0], appDir], [globs[1], pubDir]]) {
      for await (const file of glob.scan({ cwd: dir }))
        sources += await Bun.file(join(dir, file)).text() + '\n';
    }

    const { css } = await generator.generate(sources);
    setTimeout(() => { cache = null }, 50);
    return css || '';
  })(); return cache;
}

function minify(str: string) { return str
  .split('\n').map(line => line.trim())
  .filter(Boolean).join('')
}

export const plugin: BunPlugin = {
  name: 'bun-plugin-unocss', async setup(build) {
    const isDev = !build.config.minify;

    build.onResolve({ filter: /^virtual:uno\.css/ }, (args) => {
      return { path: args.path, namespace: 'unocss' };
    });

    build.onLoad({ filter: /.*/, namespace: 'unocss' }, async () => {
      const css = transform({
        filename: 'virtual:uno.css', minify: !isDev,
        code: new Uint8Array(Buffer.from( await process() )),
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
      `), loader: 'js' };
    });

    isDev && build.onLoad({ filter: /\.(tsx|jsx)$/ }, async (args) => {
      const content = await Bun.file(args.path).text();
      const nocache = `\nimport "virtual:uno.css";`;

      return {
        contents: content + nocache,
        loader: args.path.endsWith('.tsx') ? 'tsx' : 'jsx'
      };
    });
  }
}

export default plugin;