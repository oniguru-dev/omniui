import type { JSX, HTMLAttributes, ComponentChildren } from 'preact';
import { useEffect } from 'preact/hooks';

export function LiquidGlass({ children, class: className = '', ...props }: {
  children?: ComponentChildren; class?: string } & HTMLAttributes<HTMLDivElement>
): JSX.Element {
  useEffect(() => { if (!document.getElementById('liquid-glass')) {
    const s = document.createElement('style');
    s.id = 'liquid-glass'; s.textContent = `.liquid-glass{-webkit-backdrop-filter:blur(12px) saturate(1.5);backdrop-filter:blur(12px) saturate(1.5);background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.08);box-shadow:inset 0 1px rgba(255,255,255,.15),0 8px 32px rgba(0,0,0,.12);position:relative;overflow:hidden}`;
    document.head.appendChild(s);
  }; }, []);

  return (
    <div class={`liquid-glass ${className}`} {...props}>
      {children}
    </div>
  );
}