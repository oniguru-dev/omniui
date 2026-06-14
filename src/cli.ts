#!/usr/bin/env bun

import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import {
  existsSync, writeFileSync,
  readFileSync, cpSync
} from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_DIR = join(__dirname, '..');
const TEMPLATE_DIR = join(PKG_DIR, 'template');

const args = process.argv.slice(2);
const cmd = args[0] || 'dev';

// ── bun create omniui <name> ──

if (cmd === 'create') {
  const name = args[1];
  if (!name) {
    console.log('Usage: bun create omniui <project-name>');
    process.exit(1);
  }

  const target = join(process.cwd(), name);
  if (existsSync(target)) {
    console.error(`Error: ${name} already exists`);
    process.exit(1);
  }

  console.log(`Creating ${name}...`);
  cpSync(TEMPLATE_DIR, target, { recursive: true });

  // update package.json
  const pkgPath = join(target, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  pkg.name = name; // update package.json name
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

  console.log(`\n  cd ${name}`);
  console.log('  bun install');
  console.log('  bun omniui dev\n');
  process.exit(0);
}

// ── dev / build / start ──

function run() {
  const child = spawn('bun', ['--watch', join(__dirname, 'server.ts')], {
    stdio: 'inherit',
    cwd: process.cwd(),
  });

  child.on('exit', (code) => {
    if (code === 0) run();
  });
}

if (cmd === 'dev') {
  run();
} else if (cmd === 'build') {
  spawn('bun', [join(__dirname, 'scripts/build.script.ts')], { stdio: 'inherit' });
} else if (cmd === 'start') {
  spawn('bun', [join(__dirname, 'server.ts')], { stdio: 'inherit' });
} else {
  console.log('Usage: omniui <dev|build|start|create>');
}
