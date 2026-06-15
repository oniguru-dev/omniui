/**
 * omniui — Lightweight UI Framework
 * Built with Preact & UnoCSS | @omnidev
 */

import { join, dirname } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';

export const cwd = process.cwd();
export const source = dirname(Bun.main);
export const srcRoot = join(source, '..');

let _pkgRoot: string | null = null;

export function pkgRoot(): string {
  if (_pkgRoot) return _pkgRoot;

  let dir = srcRoot;

  while (dir !== dirname(dir)) {
    if (existsSync(join(dir, 'package.json'))) {
      const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf-8'));
      if (pkg.name === '@omnixui/omniui') { _pkgRoot = dir; return dir; }
    }
    dir = dirname(dir);
  }

  _pkgRoot = join(srcRoot, '..');
  return _pkgRoot;
}

export function resolve(name: string): string {
  const user = join(cwd, name);
  if (existsSync(user)) return user;
  const pkg = join(pkgRoot(), name);
  return existsSync(pkg) ? pkg : user;
}
