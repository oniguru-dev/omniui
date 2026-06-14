/** @jsxImportSource preact */
import { type JSX } from 'preact';
import { type ComponentChildren } from 'preact';
import { useState, useRef } from 'preact/hooks';

export function TiltCard({ children, class: className = '' }:
  { children: ComponentChildren; class?: string }
): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({});

  const handleMouseMove = (e: MouseEvent) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left; const y = e.clientY - rect.top;
    const centerX = rect.width / 2; const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -3;
    const rotateY = ((x - centerX) / centerX) * 3;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`,
      transition: 'transform 0.1s ease-out' // smooth transition with duration
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
      transition: 'transform 0.5s ease-in'
    });
  };

  return ( <div
    ref={ref} style={style}
    onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
    class={`will-change-transform ${className}`}
  > {children} </div> );
};