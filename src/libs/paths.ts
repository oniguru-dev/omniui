/**
 * omniui — Lightweight UI Framework
 * Built with Preact & UnoCSS | @omnidev
 */

import { join, dirname } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';

export const cwd = process.cwd();
export const source = dirname(Bun.main);
export const srcRoot = join(source, '..');

let _projectRoot: string | null = null;

/**
 * Корень проекта — ближайший предок CWD, содержащий app/index.html.
 * Позволяет запускать dev/build из любого места (в т.ч. изнутри
 * установленного пакета @omnixui/omniui), не ломая резолвинг.
 */
export function projectRoot(): string {
  if (_projectRoot) return _projectRoot;
  let dir = cwd; // root directory

  while (dir !== dirname(dir)) {
    if (existsSync(join(dir, 'app', 'index.html'))) {
      _projectRoot = dir; return dir;
    }

    dir = dirname(dir);
  }

  _projectRoot = cwd;
  return _projectRoot;
}

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