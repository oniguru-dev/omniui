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