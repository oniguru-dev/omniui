import type { BunPlugin } from "bun";

const USE_SERVER = "'use server'";
const USE_CLIENT = "'use client'";

async function getDirective(filePath: string): Promise<'server' | 'client' | null> {
  try {
    const content = await Bun.file(filePath).text();
    const directive = content.split('\n')[0]?.trim() || '';

    if (directive === USE_SERVER || directive === '"use server"') return 'server';
    if (directive === USE_CLIENT || directive === '"use client"') return 'client';

    return null;
  } catch {
    return null;
  }
}

function generateProxy(path: string, exports: string[]): string {
  const imports = path.replace(/\\/g, '/');
  const proxies = exports.map(name => `
export async function ${name}(...args) {
  const response = await fetch('/_bun/rsc', { method: 'POST',
    headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(
      { module: '${imports}', function: '${name}', args }
    )
  });

  if (!response.ok) throw new Error(
    \`RSC call failed: \${response.statusText}\`
  );

  const data = await response.json();
  return data.result;
}`).join('\n');

  return proxies;
}

export const plugin: BunPlugin = {
  name: "bun-plugin-directives", async setup(build) {
    build.onLoad({ filter: /\.(ts|tsx)$/, namespace: "file" }, async (args) => {
      const directive = await getDirective(args.path);

      if (directive === 'server') {
        const content = await Bun.file(args.path).text();
        const exports: string[] = []; let match; let regexp;

        regexp = /export\s+(?:async\s+)?function\s+(\w+)/g; // regexp for function exports
        while ((match = regexp.exec(content)) !== null) exports.push(match[1]!);
        regexp = /export\s+const\s+(\w+)\s*=/g; // regexp for const exports
        while ((match = regexp.exec(content)) !== null) exports.push(match[1]!);

        const proxy = generateProxy(args.path, exports);
        return { contents: proxy, loader: "js" };
      }

      return undefined;
    });
  }
};

export default plugin;