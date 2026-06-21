/**
 * omniui — Lightweight UI Framework
 * Built with Preact & UnoCSS | @omnidev
 */

import type { BunPlugin } from "bun";
import { Glob } from "bun";
import { join } from "path";
import { getConfig } from "../libs/config";

export const plugin: BunPlugin = {
  name: "virtual-routes", async setup(build) {
    build.onResolve({ filter: /^virtual:routes$/ }, (args) => {
      return { path: args.path, namespace: "virtual-routes" };
    });

    build.onLoad({ filter: /.*/, namespace: "virtual-routes" }, async () => {
      const config = getConfig();
      const strictCase = config.routing?.strictCase ?? false;

      const pageGlob = new Glob("**/page.{ts,tsx}");
      const layoutGlob = new Glob("**/layout.{ts,tsx}");
      const imports: string[] = []; const layouts: string[] = [];

      // Scan page files
      for await (const file of pageGlob.scan({
        cwd: join(process.cwd(), "app"), onlyFiles: true
      })) {
        const segments = file.replace(/\\/g, '/').split('/');
        if (segments.slice(0, -1).some(s => s.startsWith('_'))) continue;

        let route = "/" + file.replace(/\\/g, "/");
        if (!strictCase) route = route.toLowerCase();
        route = route.replace(/\/?page\.(ts|tsx)$/, "");
        if (route === "") route = "/";

        route = route.replace(/\[([^\]]+)\]/g,
          (_match, path) => `:${path}`
        );

        const path = `./app/${file.replace(/\\/g, "/")}`;
        imports.push(` "${route}": () => import("${path}")`);
      }

      // Scan layout files
      for await (const file of layoutGlob.scan({
        cwd: join(process.cwd(), "app"), onlyFiles: true
      })) {
        const segments = file.replace(/\\/g, '/').split('/');
        if (segments.slice(0, -1).some(s => s.startsWith('_'))) continue;

        let route = "/" + file.replace(/\\/g, "/");
        if (!strictCase) route = route.toLowerCase();
        route = route.replace(/\/?layout\.(ts|tsx)$/, "");
        if (route === "") route = "/";

        const path = `./app/${file.replace(/\\/g, "/")}`;
        layouts.push(` "${route}": () => import("${path}")`);
      }

      const func = strictCase ? `
export function route(path) {
  return path;
}` : `
export function route(path) {
  return path.toLowerCase();
}`;

      const contents = `
export const pages = {
${imports.join(",\n")}
};

export const layouts = {
${layouts.join(",\n")}
};${func}
      `.trim();

      return { contents, loader: "js" };
    });
  }
};

export default plugin;