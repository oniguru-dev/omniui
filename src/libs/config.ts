import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const cache = new Map<string, Record<string, any>>();

export function getConfig(cwd?: string): Record<string, any> {
  const dir = cwd || process.cwd();
  if (cache.has(dir)) return cache.get(dir)!;

  const path = join(dir, 'omniui.config.ts');
  if (!existsSync(path)) return {};

  const content = readFileSync(path, 'utf-8');
  const match = content.match(/const\s+config\s*=\s*(\{[\s\S]*?\});/);
  if (!match) return {};

  try {
    const config = new Function('return (' + match[1] + ')')();
    cache.set(dir, config); return config;
  } catch {
    return {};
  }
}
