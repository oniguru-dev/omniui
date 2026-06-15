/** @jsxImportSource preact */
import type { JSX, HTMLAttributes, ComponentChildren } from 'preact';
import { useEffect } from 'preact/hooks';

interface LiquidGlassProps extends HTMLAttributes<HTMLDivElement> {
  children?: ComponentChildren;
}

export function LiquidGlass({
  children, class: className = '', ...props
}: LiquidGlassProps): JSX.Element {
  useEffect(() => { if (!document.getElementById('liquid-glass')) {
    const style = document.createElement('style');
    style.id = 'liquid-glass'; style.innerHTML = `\
.liquid-glass{background:rgba(255,255,255,.04);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);border:1px solid rgba(255,255,255,.06);box-shadow:inset 0 1.1px rgba(255,255,255,.2),inset 0 -1.1px rgba(255,255,255,.05);position:relative;overflow:hidden}
    `; document.head.appendChild(style);
  }; }, []);

  return (
    <div class={`liquid-glass ${className}`} {...props}>
      {children}
    </div>
  );
}