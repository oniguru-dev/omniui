/**
 * omniui — Lightweight UI Framework
 * Built with Preact & UnoCSS | @omnidev
 */

import { useState, useRef, useEffect } from 'preact/hooks';
import type { ComponentChildren, HTMLAttributes, TargetedTouchEvent } from 'preact';
import { LiquidGlass } from "./LiquidGlass";

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'icon'> {
  variant?: 'default' | 'danger' | 'success' | 'warning';
  children: ComponentChildren; onClose?: () => void;
  time?: number; hasIcon?: boolean; icon?: ComponentChildren;
}

const VARIANTS = {
  default: {
    classes: 'border-accent/20 bg-accent/5 glow-20-accent/10 hover:glow-25-accent/25 hover:border-accent/40',
    icon: 'i-solar-info-circle-bold text-accent'
  },
  danger: {
    classes: 'border-red-500/20 bg-red-500/5 glow-20-red-500/10 hover:glow-25-red-500/25 hover:border-red-500/40',
    icon: 'i-solar-danger-circle-bold text-red-400'
  },
  success: {
    classes: 'border-green-500/20 bg-green-500/5 glow-20-green-500/10 hover:glow-25-green-500/25 hover:border-green-500/40',
    icon: 'i-solar-check-circle-bold text-green-400'
  },
  warning: {
    classes: 'border-orange-500/20 bg-orange-500/5 glow-20-orange-500/10 hover:glow-25-orange-500/25 hover:border-orange-500/40',
    icon: 'i-solar-danger-triangle-bold text-orange-400'
  },
} as const;

export function Alert({
  variant = 'default', children, onClose,
  time, hasIcon: showIcon = true, icon,
  class: className = '', ...props
}: AlertProps) {
  const [paused, setPaused] = useState(false);
  const [swipeState, setSwipeState] = useState(false);
  const [dismissing, setDismissing] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);

  const positionX = useRef(0);
  const timerRef = useRef<any>(null);

  const handleDismiss = () => {
    setDismissing(true); setTimeout(
      () => onClose?.(), 300
    );
  };

  useEffect(() => {
    if (!time || dismissing) return;

    if (!paused) timerRef.current = setTimeout(handleDismiss, time);
    else if (timerRef.current) clearTimeout(timerRef.current);

    return () => clearTimeout(timerRef.current);
  }, [time, paused, dismissing]);

  // Swipe gestures (touch events)
  const onTouchStart = (e: TargetedTouchEvent<HTMLDivElement>) => {
    setSwipeState(true); setPaused(true);
    positionX.current = e.touches[0]!.clientX;
  };

  const onTouchMove = (e: TargetedTouchEvent<HTMLDivElement>) => {
    if (!swipeState) return; // prevents swiping when dismissing
    const diff = e.touches[0]!.clientX - positionX.current;
    if (diff > 0) setSwipeOffset(diff);
  };

  const onTouchEnd = () => {
    setSwipeState(false); setPaused(false);
    if (swipeOffset > 100) handleDismiss();
    else setSwipeOffset(0);
  };

  // Styling and animations
  const type = VARIANTS[variant || 'default'];

  const style = {
    opacity: dismissing ? 0 : 1 - Math.min(swipeOffset / 250, 0.8),
    transform: dismissing ? 'translateX(100%) scale(0.95)' : `translateX(${swipeOffset}px)`,
  };

  const transition = swipeState ? 'transition-none'
    : 'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]';

  return (
    <LiquidGlass
      {...props} role="alert"
      onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      style={style}
      class={`relative w-full rounded-2xl border p-5 backdrop-blur-md select-none touch-pan-y pointer-events-auto text-white ${transition} ${type.classes} ${className}`}
    >
      <div class="flex items-start gap-3.5 w-full relative z-10">
        {showIcon && (icon ||
          <div class={`size-5 mt-0.5 flex-shrink-0 ${type.icon}`} />
        )}
        <div class="flex flex-col flex-1 min-w-0">
          {children}
        </div>
      </div>
    </LiquidGlass>
  );
}

export function AlertTitle({ children, class: className = '', ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h5 class={`font-bold leading-tight tracking-tight text-sm mb-1 text-white ${className}`} {...props}>
    {children}
  </h5>;
}

export function AlertDescription({ children, class: className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div class={`text-xs text-gray/80 leading-relaxed font-medium ${className}`} {...props}>
    {children}
  </div>;
}