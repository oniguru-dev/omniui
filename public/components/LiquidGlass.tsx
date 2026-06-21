/**
 * omniui — Lightweight UI Framework
 * Built with Preact & UnoCSS | @omnidev
 */

import type { JSX, HTMLAttributes, ComponentChildren } from 'preact';

export interface LiquidGlassProps
extends HTMLAttributes<HTMLDivElement> {
  children?: ComponentChildren;
  class?: string;
}

export function LiquidGlass({ children, class: className = '', ...props }: LiquidGlassProps): JSX.Element {
  return (
    <div class={`backdrop-blur-xl backdrop-saturate-1.5 bg-white/5 border border-white/10 relative overflow-hidden ${className}`}
      style={{ boxShadow: 'inset 0 1px rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.12)' }} {...props}
    >{children}</div>
  );
}