#!/usr/bin/env bun

import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const cmd = args[0] || 'dev';

function run() {
  const child = spawn('bun', ['--watch', join(__dirname, 'server.ts')], {
    stdio: 'inherit',
    cwd: process.cwd(),
  });

  child.on('exit', (code) => {
    if (code === 0) run(); // restart on clean exit
  });
}

if (cmd === 'dev') {
  run();
} else if (cmd === 'build') {
  spawn('bun', [join(__dirname, 'scripts/build.script')], { stdio: 'inherit' });
} else if (cmd === 'start') {
  spawn('bun', [join(__dirname, 'server.ts')], { stdio: 'inherit' });
} else {
  console.log(`Usage: omniui <dev|build|start>`);
}
