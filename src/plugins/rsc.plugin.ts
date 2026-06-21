/**
 * omniui — Lightweight UI Framework
 * Built with Preact & UnoCSS | @omnidev
 */

import type { BunPlugin } from "bun";

export const plugin: BunPlugin = {
  name: "bun-plugin-rsc", async setup(build) {
    build.onResolve({ filter: /^virtual:rsc$/ }, (args) => {
      return { path: args.path, namespace: "rsc" };
    });

    build.onLoad({ filter: /.*/, namespace: "rsc" }, async () => {
      const contents = `
export async function callServer(modulePath, functionName, args) {
  const response = await fetch('/_bun/rsc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: modulePath + ':' + functionName, args })
  });

  if (!response.ok) throw new Error(
    \`RSC call failed: \${response.statusText}\`
  );

  return response.json();
}
      `.trim();

      return { contents, loader: "js" };
    });
  }
};

export default plugin;