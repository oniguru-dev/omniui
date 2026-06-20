import type { JSX } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import lottie, { type AnimationItem } from 'lottie-web';
import { gunzipSync } from 'fflate';

async function getLottieData(path: string) {
  const buf = await (await fetch(path)).arrayBuffer();
  const data = gunzipSync(new Uint8Array(buf));
  return JSON.parse(new TextDecoder().decode(data));
}

export interface StickerProps {
  src: string;
  loop?: boolean;
  class?: string;
}

export function Sticker({
  src, loop = true,
  class: className = ''
}: StickerProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    let cancelled = false

    getLottieData(src).then((animationData) => {
      if (cancelled || !containerRef.current) return;

      animationRef.current?.destroy();
      animationRef.current = lottie.loadAnimation({
        container: containerRef.current, renderer: 'canvas',
        loop, autoplay: true, animationData
      })
    });

    return () => { cancelled = true
      animationRef.current?.destroy();
      animationRef.current = null;
    };
  }, [src, loop]);

  return <div ref={containerRef} class={className} role="img" aria-label="Animated sticker" />
}
