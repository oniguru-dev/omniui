/**
 * omniui — Lightweight UI Framework
 * Built with Preact & UnoCSS | @omnidev
 */

import type { BunPlugin } from 'bun';

import { plugin as router } from './plugins/router.plugin';
import { plugin as rsc } from './plugins/rsc.plugin';
import { plugin as directives } from './plugins/directives.plugin';
import { plugin as unocss } from './plugins/unocss.plugin';

const plugins = [
  router, rsc, directives,
  unocss // for styles
];

/**
 * Aggregate framework plugin.
 *
 * Consumed by the following:
 * - Bun's native dev pipeline via `[serve.static] plugins` in `bunfig.toml`
 * - `build.script.ts` if it ever switches to the aggregate.
 */
export const plugin: BunPlugin = {
  name: "omniui", async setup(build) {
    for (const plugin of plugins)
      await plugin.setup(build);
  },
};

export default plugin;