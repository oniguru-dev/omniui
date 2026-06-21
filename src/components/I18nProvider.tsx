/**
 * omniui — Lightweight UI Framework
 * Built with Preact & UnoCSS | @omnidev
 */

import type { ComponentChildren } from 'preact';
import { useMemo } from 'preact/hooks';
import { I18nContext } from './I18n';

function flatten(
  obj: Record<string, any>, prefix = ''
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null)
      Object.assign(result, flatten(value, path));
    else result[path] = String(value);
  }

  return result;
}

export function I18nProvider({ locale, messages, locales = [], children }: {
  locale: string; messages: Record<string, any>;
  locales?: string[]; children: ComponentChildren;
}) {
  const flat = useMemo(() => flatten(messages), [messages]);

  return <I18nContext.Provider value={{ locale, locales, t: (
    key: string, params?: Record<string, string | number>
  ) => {
    let text = flat[key] || key;

    if (params) for (const [k, v] of Object.entries(params))
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));

    return text;
  }, }}>{children}</I18nContext.Provider>;
}