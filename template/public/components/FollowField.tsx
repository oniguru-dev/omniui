import type { JSX, ComponentChildren } from 'preact';
import { useRef, useEffect } from 'preact/hooks';

interface ItemState {
  element: HTMLElement;
  x: number; y: number;
  tx: number; ty: number;
  cx: number; cy: number;
  speed: number;
}

export function FollowField({ id, class: className = '', children }: {
  id?: string; class?: string; children: ComponentChildren;
}): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    let raf = 0; let timed = 0;
    let state = false; // state
    const items: ItemState[] = [];

    // cache
    let rootLeft = 0;
    let rootTop = 0;

    const readGeometry = () => {
      const rect = root.getBoundingClientRect();
      rootLeft = rect.left; rootTop = rect.top;

      for (const item of items) {
        const bounds = item.element.getBoundingClientRect();
        item.cx = (bounds.left - item.x) + bounds.width / 2 - rootLeft;
        item.cy = (bounds.top - item.y) + bounds.height / 2 - rootTop;
      }
    };

    const loop = (now: number) => {
      if (!timed) timed = now;

      const dt = Math.min(
        (now - timed) / 1000, 0.1
      ); timed = now;

      let moving = false;

      for (const item of items) {
        const dx = item.tx - item.x;
        const dy = item.ty - item.y;

        if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
          const ease = 1 - Math.exp(-item.speed * 60 * dt);
          moving = true; item.x += dx * ease; item.y += dy * ease;

          item.element.style.transform = `translate3d(${item.x.toFixed(1)}px, ${item.y.toFixed(1)}px, 0)`;
        } else if (item.x !== item.tx || item.y !== item.ty) {
          item.x = item.tx; item.y = item.ty;

          item.element.style.transform = item.x === 0 && item.y === 0
            ? '' : `translate3d(${item.x}px, ${item.y}px, 0)`;
        }
      }

      if (moving || state)
        raf = requestAnimationFrame(loop);
      else { raf = 0; timed = 0; }
    };

    const onEnter = (e: MouseEvent) => {
      state = true; readGeometry();

      const mx = e.clientX - rootLeft;
      const my = e.clientY - rootTop;

      for (const item of items) {
        item.tx = mx - item.cx;
        item.ty = my - item.cy;
      }

      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: MouseEvent) => {
      const mx = e.clientX - rootLeft;
      const my = e.clientY - rootTop;

      for (const item of items) {
        item.tx = mx - item.cx;
        item.ty = my - item.cy;
      }

      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onLeave = () => {
      state = false;

      for (const item of items) {
        item.tx = 0; item.ty = 0;
      }

      if (!raf) raf = requestAnimationFrame(loop);
    };

    root.querySelectorAll<HTMLElement>('[data-magnetic],.follow').forEach(element => {
      element.style.setProperty('will-change', 'transform');
      element.style.setProperty('transition', 'none', 'important');

      items.push({
        element, x: 0, y: 0, tx: 0, ty: 0, cx: 0, cy: 0,
        speed: parseFloat(element.dataset.magnetic || '') || 0.12,
      });
    });

    window.addEventListener('resize', readGeometry);
    root.addEventListener('mouseenter', onEnter);
    root.addEventListener('mousemove', onMove);
    root.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('resize', readGeometry);
      root.removeEventListener('mouseenter', onEnter);
      root.removeEventListener('mousemove', onMove);
      root.removeEventListener('mouseleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <div style={{ position: 'relative' }}
    ref={ref} id={id} class={className}
  >{children}</div>;
}