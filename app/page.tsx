import { useEffect, useState, useRef } from "preact/hooks";
import { LiquidGlass } from "@/components/LiquidGlass";
import { FollowField } from "@/components/FollowField";
import { TiltCard } from "@/components/TiltCard";
import { Link } from "wouter-preact";
import { getServerTime } from "./server";

function ServerTime() {
  const [data, setData] = useState<{
    time: string; date: string;
    server: string
  } | null>(null);

  const [loading, setLoading] = useState(false);

  const fetchTime = () => {
    setLoading(true); getServerTime()
      .then(data => { setData(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchTime(); }, []);

  return (
    <div class="p-10 rounded-3xl border border-white/5 bg-white/2 h-full flex flex-col items-center justify-center text-center">
      <div class="i-solar-server-bold text-5xl mb-4" />
      <span class="text-xl font-bold text-white mb-2">Server Component</span>
      <span class="text-sm text-gray-400 mb-6">Данные с сервера через RSC</span>
      {data ? (
        <div class="space-y-1">
          <div class="font-mono text-2xl text-accent font-bold">{data.time}</div>
          <div class="text-sm text-gray-500">{data.date}</div>
          <div class="text-xs text-gray-600 mt-2">via {data.server}</div>
        </div>
      ) : (
        <div class="size-6 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
      )}
      <button onClick={fetchTime} disabled={loading}
        class="mt-6 px-4 py-2 text-sm text-accent border border-accent/30 rounded-lg hover:bg-accent/10 transition-colors disabled:opacity-50"
      >
        {loading ? 'Загрузка...' : 'Обновить'}
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
  { name: "LiquidGlass", desc: "Glassmorphism с backdrop-blur", badge: "UI" },
  { name: "TiltCard", desc: "3D наклон при наведении мыши", badge: "Interactive" },
  { name: "FollowField", desc: "Зона, в которой дочерние элементы следуют за курсором", badge: "Interactive" },
  { name: "Alert", desc: "Toast-уведомления со свайп-жестами", badge: "UI" },
  { name: "Sticker", desc: "Lottie-анимации с gzip-декомпрессией", badge: "Media" },
];

function MouseGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleMove = (e: MouseEvent) => {
      el.style.setProperty("--mx", `${e.clientX}px`);
      el.style.setProperty("--my", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return ( <div ref={ref} class="pointer-events-none fixed inset-0 z-0" style={{
    background: "radial-gradient(512px circle at var(--mx, 50%) var(--my, 50%), rgba(128,64,255,0.1), transparent 50%)",
  }} /> );
}

function CodeBlock() {
  return (
    <div class="relative rounded-2xl border border-white/8 bg-white/3 overflow-hidden font-mono text-sm">
      <div class="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/5">
        <div class="size-2 rounded-full bg-white/10" />
        <div class="size-2 rounded-full bg-white/10" />
        <div class="size-2 rounded-full bg-white/10" />
        <span class="ml-2 text-[11px] text-gray-500">app/</span>
      </div>
      <div class="p-4 text-zinc-400 leading-7 whitespace-pre">
        <div><span class="text-accent">page.tsx</span>         <span class="text-gray-600">← /</span></div>
        <div><span class="text-accent">layout.tsx</span>       <span class="text-gray-600">← оболочка</span></div>
        <div><span class="text-gray-500">docs/</span></div>
        <div>  <span class="text-accent">page.tsx</span>       <span class="text-gray-600">← /docs</span></div>
        <div><span class="text-accent">api.routes.ts</span>    <span class="text-gray-600">← /api/*</span></div>
      </div>
    </div>
  );
}

function FeatureCard({ title, desc, icon }: { title: string; desc: string; icon: string }) {
  return (
    <div class="group relative flex flex-col p-6 rounded-2xl border border-white/5 bg-white/2 hover:border-accent/20 hover:bg-accent/3 transition-all duration-300">
      <div class="bg-accent/10 p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
        <div class={`${icon} text-accent text-xl`} />
      </div>
      <h3 class="text-lg font-bold text-white mb-2">{title}</h3>
      <p class="text-sm text-gray-400 leading-relaxed">{desc}</p>
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
    <div class="relative overflow-hidden bg-black text-white min-h-screen selection:bg-accent selection:text-white">
      <MouseGlow />

      {/* Navigation */}
      <nav class="fixed top-0 left-0 w-full z-50 transition-all duration-300" style={{
        background: scrollY > 50 ? "rgba(0,0,0,0.8)" : "transparent",
        backdropFilter: scrollY > 50 ? "blur(20px)" : "none",
      }}>
        <div class="flex items-center justify-between w-90% max-w-7xl mx-auto py-5">
          <Link href="/" class="flex items-center gap-3">
            <div class="size-8 bg-accent [mask:url(assets/icon.svg)_no-repeat_center/contain] [-webkit-mask:url(assets/icon.svg)_no-repeat_center/contain]" />
            <span class="text-xl font-black text-accent">Omni UI</span>
          </Link>
          <div class="hidden md:flex items-center gap-8">
            <a href="#features" onClick={(e) => scrollTo(e, "features")} class="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#components" onClick={(e) => scrollTo(e, "components")} class="text-sm text-gray-400 hover:text-white transition-colors">Components</a>
            <a href="#stack" onClick={(e) => scrollTo(e, "stack")} class="text-sm text-gray-400 hover:text-white transition-colors">Stack</a>
            <Link href="/docs/introduction" class="text-sm font-medium text-accent hover:text-white transition-colors">Docs →</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section
        class="relative min-h-screen flex flex-col items-center justify-center text-center px-6"
        style={{ opacity: heroOpacity, transform: `translateY(${heroTranslate}px)` }}
      >
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div class="absolute size-[800px] rounded-full border border-white/3 animate-[spin_60s_linear_infinite]" />
          <div class="absolute size-[600px] rounded-full border border-white/5 animate-[spin_45s_linear_infinite_reverse]" />
          <div class="absolute size-[400px] rounded-full border border-white/7 animate-[spin_30s_linear_infinite]" />
        </div>

        <div class="relative z-10 max-w-4xl">
          <h1 class="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none mb-8">
            <span class="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">Omni</span>{" "}
            <span class="bg-gradient-to-r from-accent/80 to-accent bg-clip-text text-transparent">UI</span>
          </h1>

          <p class="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Lightweight UI framework for{" "}
            <span class="text-white font-medium">Bun</span>.{" "}
            File routing, server components, UnoCSS —{" "}
            <span class="text-accent">zero complications</span>.
          </p>

          <div class="flex flex-wrap items-center justify-center gap-4">
            <Link href="/docs/introduction" class="flex items-center gap-3 px-8 py-4 bg-accent hover:bg-accent/80 rounded-full font-bold transition-all duration-300 hover:scale-105">
              Get Started <div class="i-solar-arrow-right-linear size-5" />
            </Link>
            <a href="#features" onClick={(e) => scrollTo(e, "features")} class="flex items-center gap-3 px-8 py-4 border border-white/10 hover:border-white/20 rounded-full font-medium text-gray-300 hover:text-white transition-all duration-300">
              Explore Features
            </a>
          </div>
        </div>

        <div class="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
          <div class="i-solar-arrow-down-linear size-8 text-white/30" />
        </div>
      </section>

      {/* Stack */}
      <section id="stack" class="relative py-32 px-6">
        <div class="max-w-5xl mx-auto">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stack.map((item) => (
              <TiltCard key={item.name}>
                <div class="flex flex-col items-center p-8 rounded-3xl border border-white/5 bg-white/2 hover:border-accent/20 transition-all duration-300 group">
                  <div
                    class="size-12 mb-4 bg-accent group-hover:scale-110 transition-transform duration-300"
                    style={{
                      WebkitMask: `url(${item.mask}) no-repeat center/contain`,
                      mask: `url(${item.mask}) no-repeat center/contain`,
                    }}
                  />
                  <span class="text-xl font-bold text-white mb-1">{item.name}</span>
                  <span class="text-sm text-gray-500">{item.desc}</span>
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
              <span class="bg-gradient-to-r from-accent/80 to-accent bg-clip-text text-transparent">Ничего лишнего.</span>
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
              <span class="bg-gradient-to-r from-accent/80 to-accent bg-clip-text text-transparent">компоненты</span>
            </h2>
            <p class="text-gray-400 mt-4 max-w-xl mx-auto">Интерактивные UI-элементы с анимациями и жестами.</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {components.map((c) => (
              <div key={c.name} class="group p-6 rounded-2xl border border-white/5 bg-white/2 hover:border-accent/20 transition-all duration-300">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-bold text-white">{c.name}</h3>
                  <span class="text-[10px] font-bold text-accent bg-accent/10 px-2 py-1 rounded-full uppercase tracking-wider">{c.badge}</span>
                </div>
                <p class="text-sm text-gray-400">{c.desc}</p>
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
              <span class="bg-gradient-to-r from-accent/80 to-accent bg-clip-text text-transparent">сейчас</span>
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FollowField class="rounded-3xl overflow-hidden cursor-none">
              <div class="p-10 rounded-3xl border border-white/5 bg-white/2 h-full flex flex-col items-center justify-center text-center group">
                <div class="i-solar-cursor-bold follow text-5xl mb-4 group-hover:color-accent transition-colorss" data-magnetic="1" />
                <span class="text-xl font-bold text-white mb-2">Follow Field</span>
                <span class="text-sm text-gray-400">Двигай мышью по этой карточке</span>
              </div>
            </FollowField>

            <TiltCard class="min-h-[240px]">
              <div class="p-10 rounded-3xl border border-white/5 bg-white/2 h-full flex flex-col items-center justify-center text-center">
                <div class="i-solar-card-bold text-5xl mb-4" />
                <span class="text-xl font-bold text-white mb-2">Tilt Card</span>
                <span class="text-sm text-gray-400">Наведи курсор для 3D-эффекта</span>
              </div>
            </TiltCard>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <ServerTime />

            <LiquidGlass class="p-8 rounded-3xl border border-white/5 text-center">
              <span class="text-xl font-bold text-white mb-2 block">LiquidGlass</span>
              <span class="text-sm text-gray-400">Glassmorphism с backdrop-blur — просто оберни контент</span>
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
              <p class="text-gray-400 leading-relaxed mb-6">
                Создай <code class="text-accent bg-accent/10 px-2 py-0.5 rounded text-sm">page.tsx</code> — получи страницу. Без конфигов роутера. Без регистраций.
              </p>
              <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span class="flex items-center gap-2"><div class="size-2 rounded-full bg-accent/25" /> File-based</span>
                <span class="flex items-center gap-2"><div class="size-2 rounded-full bg-accent/50" /> Nested layouts</span>
                <span class="flex items-center gap-2"><div class="size-2 rounded-full bg-accent/75" /> Dynamic params</span>
              </div>
            </div>
            <CodeBlock />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section class="relative py-32 px-6">
        <div class="max-w-3xl mx-auto text-center">
          <div class="p-16 rounded-[2rem] border border-white/5 bg-white/2">
            <h2 class="text-4xl md:text-5xl font-black tracking-tight mb-6">
              Начни{" "}
              <span class="bg-gradient-to-r from-accent/80 to-accent bg-clip-text text-transparent">сейчас</span>
            </h2>
            <p class="text-gray-400 mb-10 max-w-lg mx-auto">
              Минимальный фреймворк для максимальной скорости разработки.
            </p>
            <div class="flex flex-wrap items-center justify-center gap-4">
              <Link href="/docs/introduction" class="flex items-center gap-3 px-10 py-5 bg-accent hover:bg-accent/80 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105">
                Documentation <div class="i-solar-arrow-right-linear size-5" />
              </Link>
            </div>
            <div class="mt-8 font-mono text-sm text-gray-500">
              bun install && bun dev
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer class="border-t border-white/5 py-12 px-6">
        <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex items-center gap-3">
            <div class="size-6 bg-accent [mask:url(assets/icon.svg)_no-repeat_center/contain] [-webkit-mask:url(assets/icon.svg)_no-repeat_center/contain]" />
            <span class="font-bold text-accent">Omni UI</span>
          </div>
          <div class="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/docs/introduction" class="hover:text-white transition-colors">Docs</Link>
            <span class="text-white/10">|</span>
            <span>Built with Bun + Preact + UnoCSS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
