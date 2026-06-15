/** @jsxImportSource preact */
import { type JSX, type ComponentChildren } from 'preact';
import { useRef, useEffect } from 'preact/hooks';

interface FollowFieldProps {
  id?: string;
  class?: string;
  children: ComponentChildren;
}

interface ItemState {
  el: HTMLElement;
  x: number;
  y: number;
  tx: number;
  ty: number;
  speed: number;
  cx: number;
  cy: number;
}

export function FollowField({ id, class: className = '', children }: FollowFieldProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    let raf = 0;
    let active = false;
    let lastTime = 0;
    const items: ItemState[] = [];

    // Кэш для положения самого родительского контейнера
    let rootLeft = 0;
    let rootTop = 0;

    // Считываем геометрию строго ОДИН раз за сессию наведения.
    // Это исключает Forced Reflow во время движения мыши.
    const readGeometry = () => {
      const rr = root.getBoundingClientRect();
      rootLeft = rr.left;
      rootTop = rr.top;

      for (const s of items) {
        const er = s.el.getBoundingClientRect();
        // Рассчитываем положение центра относительно контейнера, убирая текущее смещение s.x / s.y
        s.cx = (er.left - s.x) + er.width / 2 - rootLeft;
        s.cy = (er.top - s.y) + er.height / 2 - rootTop;
      }
    };

    const loop = (now: number) => {
      if (!lastTime) lastTime = now;
      // Рассчитываем dt на основе встроенного таймера RAF
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      let moving = false;

      for (const s of items) {
        const dx = s.tx - s.x;
        const dy = s.ty - s.y;

        // Порог точности увеличен до 0.1, чтобы CPU не тратил ресурсы на микро-сдвиги
        if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
          moving = true;
          const ease = 1 - Math.exp(-s.speed * 60 * dt);
          s.x += dx * ease;
          s.y += dy * ease;
          s.el.style.transform = `translate3d(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px, 0)`;
        } else if (s.x !== s.tx || s.y !== s.ty) {
          s.x = s.tx;
          s.y = s.ty;
          s.el.style.transform = s.x === 0 && s.y === 0 ? '' : `translate3d(${s.x}px, ${s.y}px, 0)`;
        }
      }

      if (moving || active) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
        lastTime = 0; // Сброс таймера при остановке цикла
      }
    };

    const onEnter = (e: MouseEvent) => {
      active = true;
      readGeometry();
      
      // Сразу задаем начальные координаты смещения, чтобы анимация не ждала первого события move
      const mx = e.clientX - rootLeft;
      const my = e.clientY - rootTop;
      for (const s of items) {
        s.tx = mx - s.cx;
        s.ty = my - s.cy;
      }

      if (!raf) {
        raf = requestAnimationFrame(loop);
      }
    };

    const onMove = (e: MouseEvent) => {
      // Здесь НЕТ вызовов getBoundingClientRect(). Данные берутся из легковесного кэша.
      const mx = e.clientX - rootLeft;
      const my = e.clientY - rootTop;

      for (const s of items) {
        s.tx = mx - s.cx;
        s.ty = my - s.cy;
      }

      if (!raf) {
        raf = requestAnimationFrame(loop);
      }
    };

    const onLeave = () => {
      active = false;
      for (const s of items) {
        s.tx = 0;
        s.ty = 0;
      }
      if (!raf) {
        raf = requestAnimationFrame(loop);
      }
    };

    root.querySelectorAll<HTMLElement>('[data-magnetic],.follow').forEach(el => {
      el.style.setProperty('will-change', 'transform');
      el.style.setProperty('transition', 'none', 'important');
      items.push({
        el,
        x: 0,
        y: 0,
        tx: 0,
        ty: 0,
        speed: parseFloat(el.dataset.magnetic || '') || 0.12,
        cx: 0,
        cy: 0,
      });
    });

    // Изменение размеров окна сбрасывает закэшированную геометрию
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

  return <div ref={ref} id={id} style={{ position: 'relative' } as any} class={className}>{children}</div>;
}