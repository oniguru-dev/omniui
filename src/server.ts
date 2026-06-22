/**
 * omniui — Lightweight UI Framework
 * Built with Preact & UnoCSS | @omnidev
 */

import { Elysia } from 'elysia';
import { staticPlugin } from '@elysiajs/static';
import { rateLimit } from 'elysia-rate-limit';

import { join } from 'node:path';
import { networkInterfaces } from 'os';
import { cwd, pkgRoot } from './libs/paths';
import { getConfig } from './libs/config';

function getIp(req: any): string {
  return req.headers?.get?.('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers?.get?.('x-real-ip')
    || 'unknown';
}

// version

const PKG_DIR = pkgRoot();

const VERSION = JSON.parse(await Bun.file(
  join(PKG_DIR, 'package.json') // package.json
).text()).version;

declare const __bundle__: boolean | undefined;
const BUNDLE = typeof __bundle__ !== "undefined"
  ? __bundle__ : process.env.NODE_ENV === "bundle";

export async function main() {
  const config = getConfig();

  const app = new Elysia({ serve: {
    routes: { "/api": false, "/api/*": false }
  },
    nativeStaticResponse: true,
    precompile: true, aot: true,
    seed: { value: 'this.framework' }
  })

  // Rate Limit

  .use(rateLimit({
    duration: config.rateLimit?.duration ?? 60000,
    max: config.rateLimit?.max ?? 127, scoping: 'global',
    headers: true, generator: (req) => getIp(req),
  }))

  // XSS-protection & CSP, HSTS

  .onAfterHandle(({ set, request }) => { Object.assign(set.headers, {
    'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY', 'X-XSS-Protection': '1; mode=block', 'Referrer-Policy': 'strict-origin-when-cross-origin', 'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
  }); })

  // Error Boundary

  .onError(({ code, error, set }) => {
    if (code === 'INTERNAL_SERVER_ERROR') {
      set.status = 500;
      if (!BUNDLE) console.error('[Server]', error);
      return { error: 'Internal server error' };
    }
  })

  // RSC

  .post('/_bun/rsc', async ({ body, status }) => {
    try {
      const { id, args } = body as { id: string; args: any[] };

      if (!id || typeof id !== 'string')
        return status(400, { error: 'Invalid id' });

      const colonIdx = id.indexOf(':'); if (colonIdx === -1)
        return status(400, { error: 'Invalid id format' });

      const modulePath = id.slice(0, colonIdx);
      const functionName = id.slice(colonIdx + 1);

      if (!modulePath.startsWith('app/') || modulePath.includes('..'))
        return status(403, { error: 'Access denied' });
      if (!functionName || !/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(functionName))
        return status(400, { error: 'Invalid function name' });

      const resolved = join(process.cwd(), modulePath);
      const root = process.cwd(); // relative to #/

      if (!resolved.startsWith(root))
        return status(403, { error: 'Access denied' });

      const module = await import(resolved);
      if (typeof module[functionName] !== 'function')
        return status(400, { error: 'Function not found' });

      const result = await module[functionName](...args);
      return { result };
    } catch (err: any) {
      if (!BUNDLE) console.error('[RSC] Error:', err);

      return status(500, { error: 'Internal server error' });
    }
  })

  // middleware

  const middleware = join(cwd, 'middleware.ts');

  if (await Bun.file(middleware).exists()) {
    const mod = await import(middleware);
    const codepoint = mod.default;
    if (codepoint) app.use(codepoint);
  }

  // api routes

  const api = join(cwd, 'app', 'api.routes.ts');

  if (await Bun.file(api).exists()) {
    const mod = await import(api);
    const plugin = mod.default;
    if (plugin) app.use(plugin);
  }

  // routes

  let opts;

  opts = {
    assets: join(cwd, 'public'), prefix: '', maxAge: 31536000,
    directive: 'must-revalidate', alwaysStatic: true
  } as const;

  app.use(!BUNDLE
    ? await staticPlugin(opts)
    : staticPlugin(opts)
  );

  opts = {
    assets: join(cwd, 'app'), prefix: '**',
    indexHTML: true, bunFullstack: true
  } as const;

  app.use(!BUNDLE
    ? await staticPlugin(opts)
    : staticPlugin(opts)
  );

  return { app, config };
}

// ── CLI ──

let session: any = null;

let localUrl = '';
let networkUrl: string | null = null;

let proxyPort: number | null = null;
let proxyIp: string | null = null;

function getLocalIP(): string | null {
  for (const name of Object.keys(networkInterfaces()))
    for (const iface of networkInterfaces()[name] ?? [])
      if (iface.family === 'IPv4' && !iface.internal) return iface.address;
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

function printBanner(local: string, network: string | null) {
  console.log(`
  ${ACCENT}  Omni UI${R} ${DIM}v${VERSION}${R}

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

function cleanUPnP() {
  if (!proxyPort || !proxyIp) return; try {
    Bun.spawn([
      'netsh', 'interface', 'portproxy', 'delete', 'v4tov4',
      'listenaddress=0.0.0.0', `listenport=${proxyPort}`,
    ], { stdio: ['ignore', 'pipe', 'pipe'] });
  } catch {
    console.warn('[UPnP] portproxy unavailable');
  }
}

function shutdown() {
  if (session) { session.stop(); session = null; }
  cleanUPnP();
}

process.on('exit', shutdown);
process.on('SIGTERM', () => { shutdown(); process.exit(0); });
process.on('SIGINT', () => { shutdown(); process.exit(0); });

async function startServer() {
  if (session) {
    session.stop(); session = null;
    cleanUPnP(); // cleanup portproxy
  };

  const { app, config } = await main();
  const port = config.port ?? 8080;
  const host = config.local ? '127.0.0.1' : '0.0.0.0';

  session = app.listen({ port, hostname: host });
  localUrl = `http://localhost:${port}`;
  const ip = config.local ? null : getLocalIP();
  networkUrl = ip ? `http://${ip}:${port}` : null;

  if (config.upnp && ip) {
    const asPort = /^\d{1,5}$/.test(String(port)); // port forwarding
    const asIp = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip);

    if (asIp && asPort) { try {
      const proc = Bun.spawn([
        'netsh', 'interface', 'portproxy', 'add', 'v4tov4',
        'listenaddress=0.0.0.0', `listenport=${port}`,
        `connectaddress=${ip}`, `connectport=${port}`,
      ], { stdio: ['ignore', 'pipe', 'pipe'] });

      const exitCode = await proc.exited; if (exitCode !== 0) {
        const err = await new Response(proc.stderr).text();
        console.warn(`[UPnP] portproxy failed (code ${exitCode}):`, err.trim());
      } else {
        proxyPort = port;
        proxyIp = ip;
      }
    } catch (e) {
      console.warn('[UPnP] portproxy unavailable:', e);
    }; }
  }

  clearConsole(); printBanner(
    localUrl, networkUrl
  );

  if (config.browser) setTimeout(
    () => openBrowser(localUrl), 500
  );
}

startServer().then(() => {
  if (!process.stdin.isTTY) return;
  process.stdin.setRawMode?.(true); process.stdin.resume(); // raw mode
  process.stdin.setEncoding('utf-8'); process.stdin.on('data', (key: string) => {
    if (key === '\x03') {
      console.log(`\n  ${RED}✕${R}  Exiting server...\n`);
      shutdown(); process.exit(0);
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
        clearConsole(); printBanner(localUrl, networkUrl); break;
      case 'h':
        printHelp(); break; // show help
      case 'q':
        console.log(`\n  ${RED}✕${R}  Exiting server...\n`);
        shutdown(); process.exit(0); break;
    }
  });
});