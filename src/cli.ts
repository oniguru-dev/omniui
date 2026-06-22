#!/usr/bin/env bun

/**
 * omniui — Lightweight UI Framework
 * Built with Preact & UnoCSS | @omnidev
 */

import { spawn, type ChildProcess } from 'child_process';
import { pkgRoot, source } from './libs/paths';
import { getConfig } from './libs/config';

import { join } from 'path';

import {
  existsSync, writeFileSync,
  readFileSync, cpSync, rmSync
} from 'fs';

// ── paths ──

const PKG_DIR = pkgRoot();
const TEMPLATE_DIR = join(PKG_DIR, 'template');

// ── colors ──

const ACCENT = '\x1b[38;2;128;64;255m';
const DIM    = '\x1b[2m';
const R      = '\x1b[0m';

const RED    = '\x1b[38;2;255;100;100m';
const YELLOW = '\x1b[38;2;255;200;60m';
const GREEN  = '\x1b[38;2;100;220;130m';

// ── utils ──

function getVersion(): string { try {
  const pkg = JSON.parse(readFileSync(
    join(PKG_DIR, 'package.json'), 'utf-8'
  )); return pkg.version || '0.0.0';
} catch { return 'unknown'; }; }

function clearConsole() {
  process.stdout.write('\x1Bc');
}

function openBrowser(url: string) {
  const cmd = process.platform === 'darwin' ? 'open'
    : process.platform === 'win32' ? 'start' : 'xdg-open';
  try { Bun.spawn([cmd, url]); } catch {}
}

// ── create ──

function cmdCreate(name: string | undefined) {
  if (!name) {
    console.log(`\n  ${ACCENT}Usage:${R} omniui create ${GREEN}<project-name>${R}\n`);
    process.exit(1);
  }

  const target = join(process.cwd(), name);

  if (existsSync(target)) {
    console.error(`\n  ${RED}✕${R}  ${RED}${name}${R} already exists\n`);
    process.exit(1);
  }

  console.log(`\n  ${ACCENT}→${R}  Creating ${GREEN}${name}${R}...`);

  cpSync(TEMPLATE_DIR, target, { recursive: true });

  const pkgPath = join(target, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  pkg.name = name;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

  console.log(`
  ${GREEN}✔${R}  Project created!

  ${DIM}  cd${R}  ${name}
  ${DIM}  bun${R} install
  ${ACCENT}  bun omniui dev${R}
  `);
  process.exit(0);
}

// ── dev ──

let freeze = false;
let child: ChildProcess | null = null;

function killChild() {
  if (!child) return;
  try { child.kill('SIGTERM'); } catch {}
}

function startDev() {
  child = spawn('bun',
    ['--watch', join(source, 'server.ts')],
    { stdio: 'inherit', cwd: process.cwd() }
  );

  child.on('exit', (code) => {
    if (freeze) {
      freeze = false;
      startDev();
      return;
    }
    process.exit(code ?? 1);
  });
}

function cmdDev() {
  clearConsole();

  console.log(`
  ${ACCENT}  Omni UI${R} ${DIM}v${getVersion()}${R}
  ${DIM}  Starting dev server...${R}
  `);

  startDev();

  process.stdin.setRawMode?.(true); process.stdin.resume(); // raw mode
  process.stdin.setEncoding('utf-8'); process.stdin.on('data', (key: string) => {
    if (key === '\x03') {
      console.log(`\n  ${RED}✕${R}  Exiting...\n`);
      killChild(); process.exit(0);
    }

    switch (key) {
      case 'r':
        console.log(`\n  ${YELLOW}↻${R}  Restarting...\n`);
        freeze = true; killChild(); break;
      case 'o':
        openBrowser('http://localhost:8080'); break;
      case 'c':
        clearConsole(); break;
      case 'h':
        printShortcuts(); break;
      case 'q':
        console.log(`\n  ${RED}✕${R}  Exiting...\n`);
        killChild(); process.exit(0); break;
    }
  });
}

function printShortcuts() {
  console.log(`
  ${DIM}  Shortcuts${R}

  ${ACCENT}  r${R}   restart server
  ${ACCENT}  o${R}   open in browser
  ${ACCENT}  c${R}   clear console
  ${ACCENT}  h${R}   show this help
  ${ACCENT}  q${R}   quit server
  `);
}

// ── build ──

function cmdBuild() {
  console.log(`\n  ${ACCENT}→${R}  Building for production...\n`);

  const child = spawn('bun',
    [join(source, 'scripts/build.script.ts')],
    { stdio: 'inherit', cwd: process.cwd() }
  );

  child.on('exit', (code) => {
    process.exit(code ?? 1);
  });
}

// ── start ──

function cmdStart() {
  const distServer = join(process.cwd(), 'dist', 'src', 'server.js');

  if (!existsSync(distServer)) {
    console.log(`
  ${RED}✕${R}  ${RED}dist/src/server.js${R} not found. Run ${ACCENT}omniui build${R} first.
    `);
    process.exit(1);
  }

  const config = getConfig();
  const port = config.port ?? 8080;

  console.log(`
  ${ACCENT}  Omni UI${R} ${DIM}v${getVersion()}${R}
  ${DIM}  Production server${R}
  ${ACCENT}  →${R}  ${GREEN}http://localhost:${port}${R}
  `);

  const child = spawn('bun', [distServer], {
    stdio: 'inherit',
    cwd: process.cwd()
  });

  child.on('exit', (code) => {
    process.exit(code ?? 1);
  });

  process.on('SIGINT', () => { child.kill(); process.exit(0); });
  process.on('SIGTERM', () => { child.kill(); process.exit(0); });
}

// ── preview ──

function cmdPreview() {
  const distDir = join(process.cwd(), 'dist');

  if (!existsSync(distDir)) {
    console.log(`
  ${RED}✕${R}  ${RED}dist/${R} not found. Run ${ACCENT}omniui build${R} first.
    `);
    process.exit(1);
  }

  const config = getConfig();
  const port = config.previewPort ?? 4173;

  console.log(`
  ${ACCENT}  Omni UI${R} ${DIM}v${getVersion()}${R}
  ${DIM}  Preview — serving ${GREEN}dist/${R}
  ${ACCENT}  →${R}  ${GREEN}http://localhost:${port}${R}
  `);

  const child = spawn('bun', [
    '--watch', join(source, 'server.ts')
  ], {
    stdio: 'inherit',
    cwd: process.cwd(),
    env: { ...process.env, PREVIEW: 'true' }
  });

  child.on('exit', (code) => {
    process.exit(code ?? 1);
  });

  process.on('SIGINT', () => { child.kill(); process.exit(0); });
  process.on('SIGTERM', () => { child.kill(); process.exit(0); });
}

// ── clean ──

function cmdClean() {
  const distDir = join(process.cwd(), 'dist');

  if (!existsSync(distDir)) {
    console.log(`\n  ${DIM}Nothing to clean${R}\n`);
    return;
  }

  console.log(`\n  ${ACCENT}→${R}  Cleaning ${GREEN}dist/${R}...`);

  rmSync(distDir, { recursive: true, force: true });

  console.log(`  ${GREEN}✔${R}  Done\n`);
}

// ── info ──

function cmdInfo() {
  const bunVersion = Bun.version || 'unknown';
  const nodeVersion = process.version;
  const platform = process.platform;
  const arch = process.arch;

  let omniuiVersion = 'unknown';
  try {
    const pkg = JSON.parse(readFileSync(join(PKG_DIR, 'package.json'), 'utf-8'));
    omniuiVersion = pkg.version;
  } catch {}

  let typescriptVersion = 'not installed';
  try {
    const tsPath = require.resolve('typescript/package.json', {
      paths: [process.cwd()]
    });
    const tsPkg = JSON.parse(readFileSync(tsPath, 'utf-8'));
    typescriptVersion = tsPkg.version;
  } catch {}

  let unocssVersion = 'not installed';
  try {
    const unoPath = require.resolve('unocss/package.json', {
      paths: [process.cwd()]
    });
    const unoPkg = JSON.parse(readFileSync(unoPath, 'utf-8'));
    unocssVersion = unoPkg.version;
  } catch {}

  const cwd = process.cwd();
  const hasConfig = existsSync(join(cwd, 'omniui.config.ts'));
  const hasUnoConfig = existsSync(join(cwd, 'uno.config.ts'));
  const hasApp = existsSync(join(cwd, 'app'));
  const hasDist = existsSync(join(cwd, 'dist'));

  console.log(`
  ${ACCENT}  Omni UI Environment${R}

  ${DIM}  Packages${R}
  ${ACCENT}  omniui${R}       ${GREEN}${omniuiVersion}${R}
  ${ACCENT}  unocss${R}        ${GREEN}${unocssVersion}${R}
  ${ACCENT}  typescript${R}    ${GREEN}${typescriptVersion}${R}

  ${DIM}  Runtime${R}
  ${ACCENT}  bun${R}           ${GREEN}${bunVersion}${R}
  ${ACCENT}  node${R}          ${GREEN}${nodeVersion}${R}
  ${ACCENT}  platform${R}      ${GREEN}${platform} ${arch}${R}

  ${DIM}  Project${R}
  ${ACCENT}  root${R}          ${GREEN}${cwd}${R}
  ${ACCENT}  config${R}        ${hasConfig ? GREEN + 'found' : YELLOW + 'missing'}${R}
  ${ACCENT}  uno.config${R}    ${hasUnoConfig ? GREEN + 'found' : YELLOW + 'missing'}${R}
  ${ACCENT}  app/${R}          ${hasApp ? GREEN + 'found' : YELLOW + 'missing'}${R}
  ${ACCENT}  dist/${R}         ${hasDist ? GREEN + 'found' : YELLOW + 'missing'}${R}
  `);
}

// ── version ──

function cmdVersion() {
  console.log(`  ${ACCENT}omniui${R} v${GREEN}${getVersion()}${R}`);
}

// ── help ──

function cmdHelp() {
  console.log(`
  ${ACCENT}  Omni UI${R} ${DIM}v${getVersion()}${R}

  ${DIM}  Commands${R}

  ${ACCENT}  omniui create${R}   ${GREEN}<name>${R}       Create a new project
  ${DIM}  aliases: init, new${R}
  ${ACCENT}  omniui dev${R}                      Start dev server
  ${ACCENT}  omniui build${R}                    Build for production
  ${ACCENT}  omniui start${R}                    Run production server
  ${ACCENT}  omniui preview${R}                  Preview production build
  ${ACCENT}  omniui clean${R}                    Remove dist/ folder
  ${ACCENT}  omniui info${R}                     Show environment info
  ${ACCENT}  omniui version${R}                  Show version
  ${ACCENT}  omniui help${R}                     Show this help

  ${DIM}  Shortcuts (during dev)${R}

  ${ACCENT}  r${R}   restart server
  ${ACCENT}  o${R}   open in browser
  ${ACCENT}  c${R}   clear console
  ${ACCENT}  h${R}   show dev help
  ${ACCENT}  q${R}   quit server
  `);
}

// ── main ──

const args = process.argv.slice(2);
const command = args[0] || 'dev';

switch (command) {
  case 'create': case 'init': case 'new':
    cmdCreate(args[1]);
    break;

  case 'dev':
    cmdDev();
    break;

  case 'build':
    cmdBuild();
    break;

  case 'start':
    cmdStart();
    break;

  case 'preview':
    cmdPreview();
    break;

  case 'clean':
    cmdClean();
    break;

  case 'info':
    cmdInfo();
    break;

  case 'version': case '-v':
  case '--version':
    cmdVersion(); break;

  case 'help': case '-h':
  case '--help':
    cmdHelp(); break;

  default:
    console.log(`
  ${RED}✕${R}  Unknown command: ${ACCENT}${command}${R}
  ${DIM}  Run ${R}${ACCENT}omniui help${R}${DIM} to see available commands.${R}
    `); process.exit(1);
}