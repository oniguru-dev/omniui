import { join } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';

export interface I18nConfig {
  defaultLocale?: string;
  locales?: string[];
  cookie?: string;
}

const cache = new Map<string, Record<string, string>>();

function loadLocale(dir: string, locale: string): Record<string, string> {
  const key = `${dir}:${locale}`; if (cache.has(key)) return cache.get(key)!;

  const jsonPath = join(dir, `${locale}.json`); if (existsSync(jsonPath)) {
    try {
      const data = JSON.parse(readFileSync(jsonPath, 'utf-8'));
      cache.set(key, data); return data; // JSON file
    } catch {}
  }

  const tsPath = join(dir, `${locale}.ts`); if (existsSync(tsPath)) {
    const content = readFileSync(tsPath, 'utf-8');
    const match = content.match(/export\s+default\s+(\{[\s\S]*?\});/);

    if (match) { try {
        const data = new Function('return (' + match[1] + ')')();
        cache.set(key, data); return data;
    } catch {}; }
  }

  return {};
}

function flatten(obj: Record<string, any>, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value))
      Object.assign(result, flatten(value, path));
    else
      result[path] = String(value);
  }
  return result;
}

export function getTranslations(dir: string, locale: string) {
  const raw = loadLocale(dir, locale);
  return flatten(raw);
}

export function detectLocale(request: Request, config: I18nConfig): string {
  const defaultLocale = config.defaultLocale || 'en';

  const url = new URL(request.url);
  const segments = url.pathname.split('/').filter(Boolean);
  if (segments.length && config.locales?.includes(segments[0]!))
    return segments[0]!;

  const accept = request.headers.get('accept-language') || '';
  const preferred = accept.split(',').map(s => s.split(';')[0]?.trim().split('-')[0]).filter(Boolean);
  for (const lang of preferred)
    if (config.locales?.includes(lang!)) return lang!;

  return defaultLocale;
}
