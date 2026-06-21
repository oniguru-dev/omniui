/**
 * omniui — Lightweight UI Framework
 * Built with Preact & UnoCSS | @omnidev
 */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const cache = new Map<string, Record<string, any>>();

function parse(obj: string): Record<string, any> {
  const lines = obj.split('\n');
  const fixed: string[] = [];

  for (const line of lines) {
    const trim = line.trimStart();

    if (trim.startsWith('//')
      || trim.startsWith('/*')
      || trim.startsWith('*')
    ) {
      fixed.push(line);
      continue;
    }

    const match = trim.match(/^(\w+)\s*:/);

    if (match && !trim.startsWith('"') && !trim.startsWith("'")) {
      const indent = line.slice(0, line.length - trim.length);
      const rest = trim.slice(match[0].length);
      fixed.push(`${indent}"${match[1]}":${rest}`);
    } else {
      fixed.push(line);
    }
  }

  let result = fixed.join('\n');
  result = result.replace(/'([^']*)'/g, '"$1"');
  result = result.replace(/,(\s*[}\]])/g, '$1');

  return JSON.parse(result);
}

export function getConfig(cwd?: string): Record<string, any> {
  const dir = cwd || process.cwd();
  if (cache.has(dir)) return cache.get(dir)!;

  const path = join(dir, 'omniui.config.ts');
  if (!existsSync(path)) return {};

  const content = readFileSync(path, 'utf-8');
  const match = content.match(/const\s+config\s*=\s*(\{[\s\S]*?\});/);
  if (!match) return {};

  try {
    const config = parse(match[1]!);
    cache.set(dir, config); return config;
  } catch {
    return {};
  }
}
