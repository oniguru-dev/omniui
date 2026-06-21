/**
 * omniui — Lightweight UI Framework
 * Built with Preact & UnoCSS | @omnidev
 */

import { createContext } from 'preact';
import { useContext } from 'preact/hooks';

interface I18nContextType {
  locales: string[]; locale: string; t: (
    key: string, params?: Record<string, string | number>
  ) => string;
}

export const I18nContext = createContext<I18nContextType>({
  locales: [], locale: 'en', t: (key) => key,
});

export function useI18n() { return useContext(I18nContext); }
export function useTranslation() { return useI18n(); }