import { useEffect, useState } from "preact/hooks";
import { Link } from "wouter-preact";

import { LiquidGlass } from "@/components/LiquidGlass";
import { FollowField } from "@/components/FollowField";
import { TiltCard } from "@/components/TiltCard";
import { Theme } from "@/components/Theme";

import { getServerTime } from "./server";

function ServerTime() {
  const [data, setData] = useState<{
    time: string; date: string; server: string
  } | null>(null);

  const [loading, setLoading] = useState(false);

  const fetchTime = () => {
    setLoading(true); getServerTime()
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchTime(); }, []);

  return (
    <div class="p-10 rounded-3xl h-full flex flex-col items-center justify-center text-center" style={{ background: 'var(--bg-card)' }}>
      <div class="i-solar-server-bold text-5xl mb-4" style={{ color: 'var(--text-muted)' }} />
      <span class="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>Server Component</span>
      <span class="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Данные с сервера через RSC</span>
      {data ? (
        <div class="font-mono text-sm flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
          <span class="text-accent font-bold">{data.time}</span>
          <span style={{ opacity: 0.3 }}>·</span>
          <span>{data.date}</span>
          <span style={{ opacity: 0.3 }}>·</span>
          <span>{data.server}</span>
        </div>
      ) : (
        <div class="size-5 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
      )}
      <button onClick={fetchTime} disabled={loading}
        class="mt-4 px-3 py-1.5 text-xs text-accent border border-accent/20 rounded-lg hover:bg-accent/5 transition-colors disabled:opacity-50"
      >
        {loading ? '...' : 'Обновить'}
      </button>
    </div>
  );
}

const stack = [
  { name: "Bun", desc: "Runtime", mask: "/assets/icons/bun.svg" },
  { name: "Elysia", desc: "Server", mask: "/assets/icons/elysia.svg" },
  { name: "Preact", desc: "UI", mask: "/assets/icons/preact.svg" },
  { name: "UnoCSS", desc: "Styles", mask: "/assets/icons/uno.svg" },
];

const features = [
  { title: "File Routing", desc: "Страницы — файлы. Маршруты генерируются автоматически.", icon: "i-solar-folder-bold" },
  { title: "Server Components", desc: "'use server' — функции работают на сервере, вызываются из клиента.", icon: "i-solar-server-bold" },
  { title: "Asset Pipeline", desc: "Оптимизация PNG, JPEG, GIF, видео и аудио из коробки.", icon: "i-solar-gallery-bold" },
  { title: "SEO Optimization", desc: "sitemap.xml и robots.txt генерируются при сборке.", icon: "i-solar-magnifer-bold" },
  { title: "Page Transitions", desc: "Плавные переходы между страницами с canvas-анимацией.", icon: "i-solar-album-bold" },
  { title: "TypeScript", desc: "Строгий режим. Полная типизация.", icon: "i-solar-code-bold" },
];

const components = [
  { name: "LiquidGlass", desc: "Glassmorphism с backdrop-blur" },
  { name: "TiltCard", desc: "3D наклон при наведении мыши" },
  { name: "FollowField", desc: "Дочерние элементы следуют за курсором" },
  { name: "Alert", desc: "Toast-уведомления со свайп-жестами" },
  { name: "Sticker", desc: "Lottie-анимации с gzip-декомпрессией" },
];

function CodeBlock() {
  return (
    <div class="relative rounded-2xl overflow-hidden font-mono text-sm" style={{ background: 'var(--bg-card)' }}>
      <div class="flex items-center gap-1.5 px-4 py-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
        <div class="size-2 rounded-full" style={{ background: 'var(--border)' }} />
        <div class="size-2 rounded-full" style={{ background: 'var(--border)' }} />
        <div class="size-2 rounded-full" style={{ background: 'var(--border)' }} />
        <span class="ml-2 text-[11px]" style={{ color: 'var(--text-muted)' }}>app/</span>
      </div>
      <div class="p-4 leading-7 whitespace-pre" style={{ color: 'var(--text-muted)' }}>
        <div><span class="text-accent">page.tsx</span>         <span style={{ opacity: 0.4 }}>← /</span></div>
        <div><span class="text-accent">layout.tsx</span>       <span style={{ opacity: 0.4 }}>← оболочка</span></div>
        <div><span style={{ opacity: 0.6 }}>docs/</span></div>
        <div>  <span class="text-accent">page.tsx</span>       <span style={{ opacity: 0.4 }}>← /docs</span></div>
        <div><span class="text-accent">api.routes.ts</span>    <span style={{ opacity: 0.4 }}>← /api/*</span></div>
      </div>
    </div>
  );
}

function FeatureCard({ title, desc, icon }: { title: string; desc: string; icon: string }) {
  return (
    <div class="group relative flex flex-col p-6 rounded-2xl transition-all duration-300" style={{ background: 'var(--bg-card)' }}
      onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = 'var(--bg-card-hover)'}
      onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)'}
    >
      <div class="bg-accent/10 p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
        <div class={`${icon} text-accent text-xl`} />
      </div>
      <h3 class="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>{title}</h3>
      <p class="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</p>
    </div>
  );
}

function scrollTo(e: MouseEvent, id: string) {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Page() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const heroOpacity = Math.max(0, 1 - scrollY / 600);
  const heroTranslate = scrollY * 0.3;

  return (
    <div class="relative overflow-hidden min-h-screen selection:bg-accent selection:text-white" style={{ background: 'var(--bg)', color: 'var(--text)' }}>

      {/* Navigation */}
      <nav class="fixed top-0 left-0 w-full z-50 transition-all duration-300" style={{
        background: scrollY > 50 ? 'var(--nav-bg)' : 'transparent',
        backdropFilter: scrollY > 50 ? 'blur(20px)' : 'none',
        boxShadow: scrollY > 50 ? '0 1px 0 var(--border)' : 'none',
      }}>
        <div class="flex items-center justify-between w-90% max-w-7xl mx-auto py-5">
          <Link href="/" class="flex items-center gap-3">
            <div class="size-8 bg-accent [mask:url(assets/icon.svg)_no-repeat_center/contain] [-webkit-mask:url(assets/icon.svg)_no-repeat_center/contain]" />
            <span class="text-xl font-black text-accent">Omni UI</span>
          </Link>
          <div class="hidden md:flex items-center gap-8">
            <a href="#features" onClick={(e) => scrollTo(e, "features")} class="text-sm transition-colors" style={{ color: 'var(--text-muted)' }}>Features</a>
            <a href="#components" onClick={(e) => scrollTo(e, "components")} class="text-sm transition-colors" style={{ color: 'var(--text-muted)' }}>Components</a>
            <a href="#stack" onClick={(e) => scrollTo(e, "stack")} class="text-sm transition-colors" style={{ color: 'var(--text-muted)' }}>Stack</a>
            <Link href="/docs/introduction" class="text-sm font-medium text-accent transition-colors">Docs →</Link>
            <Theme />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section
        class="relative min-h-screen flex flex-col items-center justify-center text-center px-6"
        style={{ opacity: heroOpacity, transform: `translateY(${heroTranslate}px)` }}
      >
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div class="absolute size-[800px] rounded-full animate-[spin_60s_linear_infinite]" style={{ border: '1px solid var(--border)' }} />
          <div class="absolute size-[600px] rounded-full animate-[spin_45s_linear_infinite_reverse]" style={{ border: '1px solid var(--border)' }} />
          <div class="absolute size-[400px] rounded-full animate-[spin_30s_linear_infinite]" style={{ border: '1px solid var(--border)' }} />
        </div>

        <div class="relative z-10 max-w-4xl">
          <h1 class="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none mb-8">
            <span style={{ color: 'var(--text)' }}>Omni</span>{" "}
            <span class="text-accent">UI</span>
          </h1>

          <p class="text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Lightweight UI framework for{" "}
            <span class="font-medium" style={{ color: 'var(--text)' }}>Bun</span>.{" "}
            File routing, server components, UnoCSS —{" "}
            <span class="text-accent">zero complications</span>.
          </p>

          <div class="flex flex-wrap items-center justify-center gap-4">
            <Link href="/docs/introduction" class="flex items-center gap-3 px-8 py-4 bg-accent hover:bg-accent/90 rounded-full font-bold text-white transition-all duration-300 hover:scale-105">
              Get Started <div class="i-solar-arrow-right-linear size-5" />
            </Link>
            <a href="#features" onClick={(e) => scrollTo(e, "features")} class="flex items-center gap-3 px-8 py-4 rounded-full font-medium transition-all duration-300"
              style={{ background: 'var(--bg-card)', color: 'var(--text-muted)' }}
              onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = 'var(--bg-card-hover)'}
              onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)'}
            >
              Explore Features
            </a>
          </div>
        </div>

        <div class="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
          <div class="i-solar-arrow-down-linear size-8" style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
        </div>
      </section>

      {/* Stack */}
      <section id="stack" class="relative py-32 px-6">
        <div class="max-w-5xl mx-auto">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stack.map((item) => (
              <TiltCard key={item.name}>
                <div class="flex flex-col items-center p-8 rounded-3xl transition-all duration-300 group" style={{ background: 'var(--bg-card)' }}
                  onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = 'var(--bg-card-hover)'}
                  onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)'}
                >
                  <div
                    class="size-12 mb-4 bg-accent group-hover:scale-110 transition-transform duration-300"
                    style={{
                      WebkitMask: `url(${item.mask}) no-repeat center/contain`,
                      mask: `url(${item.mask}) no-repeat center/contain`,
                    }}
                  />
                  <span class="text-xl font-bold mb-1" style={{ color: 'var(--text)' }}>{item.name}</span>
                  <span class="text-sm" style={{ color: 'var(--text-muted)' }}>{item.desc}</span>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" class="relative py-32 px-6">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-16">
            <span class="text-xs font-bold text-accent tracking-widest uppercase">Framework</span>
            <h2 class="text-4xl md:text-5xl font-black tracking-tight mt-4">
              Всё что нужно.{" "}
              <span class="text-accent">Ничего лишнего.</span>
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* Components */}
      <section id="components" class="relative py-32 px-6">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-16">
            <span class="text-xs font-bold text-accent tracking-widest uppercase">Components</span>
            <h2 class="text-4xl md:text-5xl font-black tracking-tight mt-4">
              Готовые{" "}
              <span class="text-accent">компоненты</span>
            </h2>
            <p class="mt-4 max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>Интерактивные UI-элементы с анимациями и жестами.</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {components.map((c) => (
              <div key={c.name} class="group p-6 rounded-2xl transition-all duration-300" style={{ background: 'var(--bg-card)' }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = 'var(--bg-card-hover)'}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)'}
              >
                <h3 class="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>{c.name}</h3>
                <p class="text-sm" style={{ color: 'var(--text-muted)' }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Demo */}
      <section class="relative py-32 px-6">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-16">
            <span class="text-xs font-bold text-accent tracking-widest uppercase">Interactive</span>
            <h2 class="text-4xl md:text-5xl font-black tracking-tight mt-4">
              Попробуй{" "}
              <span class="text-accent">сейчас</span>
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FollowField class="rounded-3xl overflow-hidden cursor-none">
              <div class="p-10 rounded-3xl h-full flex flex-col items-center justify-center text-center group" style={{ background: 'var(--bg-card)' }}>
                <div class="i-solar-cursor-bold follow text-5xl mb-4 group-hover:text-accent transition-colors" data-magnetic="1" style={{ color: 'var(--text-muted)' }} />
                <span class="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>Follow Field</span>
                <span class="text-sm" style={{ color: 'var(--text-muted)' }}>Двигай мышью по этой карточке</span>
              </div>
            </FollowField>

            <TiltCard class="min-h-[240px]">
              <div class="p-10 rounded-3xl h-full flex flex-col items-center justify-center text-center" style={{ background: 'var(--bg-card)' }}>
                <div class="i-solar-card-bold text-5xl mb-4" style={{ color: 'var(--text-muted)' }} />
                <span class="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>Tilt Card</span>
                <span class="text-sm" style={{ color: 'var(--text-muted)' }}>Наведи курсор для 3D-эффекта</span>
              </div>
            </TiltCard>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <ServerTime />

            <LiquidGlass class="p-8 rounded-3xl text-center">
              <span class="text-xl font-bold mb-2 block" style={{ color: 'var(--text)' }}>LiquidGlass</span>
              <span class="text-sm" style={{ color: 'var(--text-muted)' }}>Glassmorphism с backdrop-blur — просто оберни контент</span>
            </LiquidGlass>
          </div>
        </div>
      </section>

      {/* Convention */}
      <section class="relative py-32 px-6">
        <div class="max-w-4xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span class="text-xs font-bold text-accent tracking-widest uppercase">Convention</span>
              <h2 class="text-4xl font-black tracking-tight mt-4 mb-6">
                Файлы — Маршруты
              </h2>
              <p class="leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
                Создай <code class="text-accent bg-accent/10 px-2 py-0.5 rounded text-sm">page.tsx</code> — получи страницу. Без конфигов роутера. Без регистраций.
              </p>
              <div class="flex flex-wrap items-center gap-4 text-sm" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
                <span class="flex items-center gap-2"><div class="size-2 rounded-full bg-accent/30" /> File-based</span>
                <span class="flex items-center gap-2"><div class="size-2 rounded-full bg-accent/50" /> Nested layouts</span>
                <span class="flex items-center gap-2"><div class="size-2 rounded-full bg-accent/70" /> Dynamic params</span>
              </div>
            </div>
            <CodeBlock />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section class="relative py-32 px-6">
        <div class="max-w-3xl mx-auto text-center">
          <div class="p-16 rounded-[2rem]" style={{ background: 'var(--bg-card)', boxShadow: '0 0 0 1px var(--border)' }}>
            <h2 class="text-4xl md:text-5xl font-black tracking-tight mb-6">
              Начни{" "}
              <span class="text-accent">сейчас</span>
            </h2>
            <p class="mb-10 max-w-lg mx-auto" style={{ color: 'var(--text-muted)' }}>
              Минимальный фреймворк для максимальной скорости разработки.
            </p>
            <div class="flex flex-wrap items-center justify-center gap-4">
              <Link href="/docs/introduction" class="flex items-center gap-3 px-10 py-5 bg-accent hover:bg-accent/90 rounded-full font-bold text-white text-lg transition-all duration-300 hover:scale-105">
                Documentation <div class="i-solar-arrow-right-linear size-5" />
              </Link>
            </div>
            <div class="mt-8 font-mono text-sm" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
              bun install && bun dev
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer class="py-12 px-6" style={{ borderTop: '1px solid var(--border)' }}>
        <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex items-center gap-3">
            <div class="size-6 bg-accent [mask:url(assets/icon.svg)_no-repeat_center/contain] [-webkit-mask:url(assets/icon.svg)_no-repeat_center/contain]" />
            <span class="font-bold text-accent">Omni UI</span>
          </div>
          <div class="flex items-center gap-6 text-sm" style={{ color: 'var(--text-muted)' }}>
            <Link href="/docs/introduction" class="transition-colors" style={{ color: 'inherit' }}>Docs</Link>
            <span style={{ opacity: 0.3 }}>|</span>
            <a href="https://github.com/oniguru-dev/omniui" target="_blank" rel="noopener" class="transition-colors" style={{ color: 'inherit' }}>GitHub</a>
            <span style={{ opacity: 0.3 }}>|</span>
            <a href="https://www.npmjs.com/package/@omnixui/omniui" target="_blank" rel="noopener" class="transition-colors" style={{ color: 'inherit' }}>npm</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
