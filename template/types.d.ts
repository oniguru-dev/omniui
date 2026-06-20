declare module 'virtual:uno.css';
declare module '*.css';

declare module 'virtual:routes' {
  import type { FunctionComponent } from 'preact';

  export const pages: Record<string, () =>
    Promise<{ default: FunctionComponent<any>; }>
  >;
  export const layouts: Record<string, () =>
    Promise<{ default: FunctionComponent<any>; }>
  >;
  export function route(path: string): string;
}

declare module '@omnixui/omniui' {
  import type { ComponentChildren, FunctionComponent } from 'preact';

  export interface ErrorBoundaryProps {
    children: ComponentChildren;
    fallback?: ComponentChildren | ((error: Error, dismiss: () => void) => ComponentChildren);
  }
  export const ErrorBoundary: FunctionComponent<ErrorBoundaryProps>;

  export interface PageLoaderProps {
    children: ComponentChildren;
    fallback?: ComponentChildren;
    duration?: number;
  }
  export const PageLoader: FunctionComponent<PageLoaderProps>;
  export const PageLoaderSignal: FunctionComponent;
  export const usePageLoader: () => () => void;

  export const Theme: FunctionComponent;

  export interface HeadProps {
    title?: string; description?: string; image?: string;
    url?: string; type?: string; robots?: string;
  }
  export const Head: FunctionComponent<HeadProps>;

  export interface LiquidGlassProps {
    children?: ComponentChildren;
    class?: string;
  }
  export const LiquidGlass: FunctionComponent<LiquidGlassProps>;

  export interface TiltCardProps {
    children: ComponentChildren;
    class?: string;
  }
  export const TiltCard: FunctionComponent<TiltCardProps>;

  export interface FollowFieldProps {
    id?: string;
    class?: string;
    children: ComponentChildren;
  }
  export const FollowField: FunctionComponent<FollowFieldProps>;

  export interface StickerProps {
    src: string;
    loop?: boolean;
    class?: string;
  }
  export const Sticker: FunctionComponent<StickerProps>;

  export interface AlertProps {
    variant?: 'default' | 'danger' | 'success' | 'warning';
    children: ComponentChildren;
    onClose?: () => void;
    time?: number;
    hasIcon?: boolean;
    icon?: ComponentChildren;
    class?: string;
  }
  export const Alert: FunctionComponent<AlertProps>;
  export const AlertTitle: FunctionComponent<{ children: ComponentChildren; class?: string }>;
  export const AlertDescription: FunctionComponent<{ children: ComponentChildren; class?: string }>;
  export const AlertProvider: FunctionComponent<{ children: ComponentChildren }>;
  export const useAlert: () => { show: (msg: string) => void };

  export function useI18n(): {
    locale: string;
    locales: string[];
    t: (key: string, params?: Record<string, string | number>) => string;
  };
  export const useTranslation: typeof useI18n;
}
