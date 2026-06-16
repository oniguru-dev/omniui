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
}

declare module '@omnixui/omniui' {
  import type { ComponentChildren, FunctionComponent } from 'preact';

  export const ErrorBoundary: FunctionComponent<{ children: ComponentChildren; fallback?: ComponentChildren | ((error: Error, dismiss: () => void) => ComponentChildren) }>;
  export const PageLoader: FunctionComponent<{ children: ComponentChildren; fallback?: ComponentChildren; duration?: number }>;
  export const PageLoaderSignal: FunctionComponent;
  export const usePageLoader: () => () => void;
  export const Theme: FunctionComponent;
  export const LiquidGlass: FunctionComponent<{ children?: ComponentChildren; class?: string }>;
  export const FollowField: FunctionComponent<{ id?: string; class?: string; children: ComponentChildren }>;
  export const TiltCard: FunctionComponent<{ children: ComponentChildren; class?: string }>;
  export const AlertProvider: FunctionComponent<{ children: ComponentChildren }>;
  export const useAlert: () => { show: (msg: string) => void };
  export const Alert: FunctionComponent<{ variant?: 'default' | 'danger' | 'success' | 'warning'; children: ComponentChildren; onClose?: () => void; time?: number }>;
  export const AlertTitle: FunctionComponent<{ children: ComponentChildren; class?: string }>;
  export const AlertDescription: FunctionComponent<{ children: ComponentChildren; class?: string }>;
  export const Gradient: FunctionComponent<{ children: ComponentChildren; class?: string; target?: string }>;
  export const Sticker: FunctionComponent<{ src: string; loop?: boolean; class?: string }>;
}