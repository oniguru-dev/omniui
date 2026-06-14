/**
 * omniui — Lightweight UI Framework
 * Built with Preact & UnoCSS | @omnidev
 */

import { Elysia } from 'elysia';
import { staticPlugin } from '@elysiajs/static';
import { apiRoutes } from '@/api.routes';
import { join, dirname } from 'node:path';
import { networkInterfaces } from 'os';

import config from '#/omniui.config';
const __dirname = join(dirname(Bun.main), '..');

declare const __bundle__: boolean | undefined;
const BUNDLE = typeof __bundle__ !== "undefined"
  ? __bundle__ : process.env.NODE_ENV === "bundle";

export async function main() {
  const app = new Elysia({ serve: {
    routes: { "/api": false, "/api/*": false }
  },
    nativeStaticResponse: true,
    precompile: true, aot: true,
    seed: { value: 'this.framework' }
  })

  .post('/_bun/rsc', async ({ body, status }) => {
    try {
      const { module: modulePath, function: functionName, args } = body as {
        module: string; function: string; args: any[];
      };

      const resolvedPath = modulePath.includes(':/') || modulePath.startsWith('/')
        ? modulePath
        : join(__dirname, '..', modulePath);
      const mod = await import(resolvedPath);

      if (typeof mod[functionName] !== 'function')
        return status(400, { error: `Function '${functionName}' not found` });

      const result = await mod[functionName](...args);
      return { result };
    } catch (err: any) {
      console.error('[RSC] Error:', err);
      return status(500, { error: err.message || 'Internal server error' });
    }
  })

  .onBeforeHandle(async ({ request, path, status }) => {
    if (path.startsWith('/api')) return;
    try {
      const file = join('./public', path);
      if (await Bun.file(file).exists()) {
        const referer = request.headers.get('referer');
        const origin = request.headers.get('origin');
        if (!referer && !origin) return status(403);
      }
    } catch {}
  })

  .use(apiRoutes);

  // routes

  let opts;

  opts = {
    assets: `${__dirname}/public`, prefix: '', maxAge: 31536000,
    directive: 'must-revalidate', alwaysStatic: true
  } as const;
  app.use(!BUNDLE ? await staticPlugin(opts) : staticPlugin(opts));

  opts = {
    assets: `${__dirname}/app`, prefix: '**',
    indexHTML: true, bunFullstack: true
  } as const;
  app.use(!BUNDLE ? await staticPlugin(opts) : staticPlugin(opts));

  return app;
}

// ── CLI ──

function getLocalIP(): string | null {
  for (const name of Object.keys(networkInterfaces())) {
    for (const iface of networkInterfaces()[name] ?? []) {
      if (iface.family === 'IPv4' && !iface.internal) return iface.address;
    }
  }
  return null;
}

function openBrowser(url: string) {
  const cmd = process.platform === 'darwin' ? 'open'
    : process.platform === 'win32' ? 'start' : 'xdg-open';
  try { Bun.spawn([cmd, url]); } catch {}
}

function clearConsole() {
  process.stdout.write('\x1Bc');
}

const ACCENT = '\x1b[38;2;128;64;255m';
const DIM = '\x1b[2m'; const R = '\x1b[0m';

const RED = '\x1b[38;2;255;100;100m';
const YELLOW = '\x1b[38;2;255;200;60m';
const GREEN = '\x1b[38;2;120;200;255m';

function printBanner(port: number, local: string, network: string | null) {
  console.log(`
  ${ACCENT}  Omni UI${R} ${DIM}v1.0.0${R}

  ${ACCENT}  →${R} Local:   ${ACCENT}${local}${R}${network ? `\n  ${ACCENT}  →${R} Network: ${ACCENT}${network}${R}` : ''}
  ${DIM}  press h to show help${R}
  `);
}

function printHelp() {
  console.log(`
  ${DIM}  Shortcuts${R}

  ${ACCENT}  r${R}  restart server
  ${ACCENT}  u${R}  show server url
  ${ACCENT}  o${R}  open in browser
  ${ACCENT}  c${R}  clear console
  ${ACCENT}  h${R}  show this help
  ${ACCENT}  q${R}  quit server
  `);
}

let localUrl = '';
let networkUrl: string | null = null;
let session: any = null;

async function startServer() {
  if (session) { session.stop(); session = null; }

  const app = await main();
  const port = config.port ?? 8080;
  const host = config.local ? '127.0.0.1' : '0.0.0.0';

  session = app.listen({ port, hostname: host });
  localUrl = `http://localhost:${port}`;
  const networkIP = config.local ? null : getLocalIP();
  networkUrl = networkIP ? `http://${networkIP}:${port}` : null;

  if (config.upnp && networkIP) { try {
    const { execSync } = await import('child_process');
    execSync(`netsh interface portproxy add v4tov4 listenport=${port} listenaddress=0.0.0.0 connectport=${port} connectaddress=${networkIP}`, { stdio: 'ignore' });
  } catch {} }

  clearConsole();
  printBanner(port, localUrl, networkUrl);

  if (config.browser) setTimeout(() => openBrowser(localUrl), 500);
}

startServer().then(() => {
  if (!process.stdin.isTTY) return;
  const stdin = process.stdin;
  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding('utf-8');

  stdin.on('data', (key: string) => {
    if (key === '\x03') {
      console.log(`\n  ${RED}✕${R}  Exiting server...\n`);
      process.exit(0);
    }
    switch (key) {
      case 'r':
        console.log(`\n  ${YELLOW}↻${R}  Restarting server...\n`);
        startServer(); break; // restart server
      case 'u':
        console.log(`\n  ${ACCENT}→${R}  ${localUrl}${networkUrl ? `\n  ${ACCENT}→${R}  ${networkUrl}` : ''}\n`);
        break; // show server url
      case 'o':
        openBrowser(localUrl); break; // open in browser
      case 'c':
        clearConsole(); printBanner(config.port ?? 8080, localUrl, networkUrl); break;
      case 'h':
        printHelp(); break; // show help
      case 'q':
        console.log(`\n  ${RED}✕${R}  Exiting server...\n`);
        process.exit(0); break;
    }
  });
});
