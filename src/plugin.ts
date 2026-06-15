import type { BunPlugin } from "bun";

import { plugin as router } from './plugins/router.plugin';
import { plugin as rsc } from './plugins/rsc.plugin';
import { plugin as directives } from './plugins/directives.plugin';
import { plugin as unocss } from './plugins/unocss.plugin';

const plugins = [router, rsc, directives, unocss];

export const plugin: BunPlugin = {
  name: "omniui",
  async setup(build) {
    for (const p of plugins) await p.setup(build);
  },
};

export default plugin;
