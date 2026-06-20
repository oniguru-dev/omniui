# CLAUDE.md — Omni UI Project

## Quick Reference

```bash
bun omniui dev           # dev server (port 8080, hot reload)
bun omniui build         # production build → dist/
bun omniui start         # production server
bun omniui preview       # preview dist/ as static
bun omniui clean         # rm dist/
```

Dev shortcuts: `r` restart, `o` browser, `c` clear, `h` help, `q` quit.

---

## Stack

- **Runtime**: Bun
- **Server**: Elysia (rate limit, static, middleware)
- **UI**: Preact (`class` not `className`)
- **CSS**: UnoCSS with `presetWind4` (TailwindCSS-compatible utilities)
- **Router**: wouter-preact (client-side, file-based)
- **Icons**: Solar icon set (`i-solar-{name}-bold` / `i-solar-{name}-linear`)
- **Animations**: Lottie (gzip-compressed JSON via fflate)
- **CSS Transform**: LightningCSS

---

## Project Structure

```
app/
  index.tsx          ← SPA entry (Router, lazy pages, ErrorBoundary)
  index.html         ← HTML shell (theme init in <script>)
  layout.tsx         ← Root layout (wraps all pages)
  page.tsx           ← Home (/)
  server.ts          ← YOUR 'use server' functions (OPTIONAL — delete freely)
  api.routes.ts      ← Elysia API plugin (/api/*)
  theme.css          ← CSS custom properties (dark/light)
  _static/           ← NOT routed (404, Fault, Fallback)
  docs/              ← /docs, /docs/:slug
public/
  assets/            ← fonts, images, icons
  components/        ← YOUR shared components (import via @/)
middleware.ts        ← Elysia middleware
docs/                ← Markdown (fetched by /api/docs)
locales/             ← i18n JSON
omniui.config.ts     ← Config (port, i18n, robots)
uno.config.ts        ← UnoCSS config + shortcuts
```

---

## Routing

File-based. Create `page.tsx` → get a route.

| File | Route |
|------|-------|
| `app/page.tsx` | `/` |
| `app/about/page.tsx` | `/about` |
| `app/docs/page.tsx` | `/docs` |
| `app/blog/[slug]/page.tsx` | `/blog/:slug` |
| `app/shop/[...all]/page.tsx` | `/shop/*` |

Files starting with `_` excluded. Nested `layout.tsx` wraps child routes.

---

## UnoCSS (TailwindCSS-compatible)

Uses `presetWind4` — same utility names as TailwindCSS. Plus custom shortcuts:

### Built-in Shortcuts
```tsx
// Glassmorphism
class="liquid-glass"          // backdrop-blur + border + shadow

// Noise texture overlay
class="noise"                 // mix-blend-soft-light + noise.png

// Gradient glow following cursor
class="gradient-root"         // radial gradient via CSS vars --gx, --gy

// Scroll-triggered reveal (starts hidden, add .visible via JS)
class="reveal"                // opacity-0 + translate-y-6
class="reveal-left"           // opacity-0 + -translate-x-6
class="reveal-right"          // opacity-0 + translate-x-6
class="reveal-scale"          // opacity-0 + scale-95
// Then: element.classList.add('visible') to animate in

// Glow effect
class="glow-8-accent"         // shadow: 0 0 8px accent
class="glow-20-red-500"       // shadow: 0 0 20px red-500

// Scrollbar
class="scrollbar"             // custom thin scrollbar
class="scrollbar-none"        // hide scrollbar
class="scrollbar-thumb-red"   // red thumb

// Animations (use in class or style)
class="fade-in-up"            // animate from bottom
class="fade-in-left"          // animate from left
class="scale-in"              // scale from 0.95
class="page-in"               // page transition in
class="loader-in"             // loader fade in
```

### Theme Colors
```css
accent: "#8040ff"             /* use as text-accent, bg-accent, border-accent/20 */
```

### Custom Animations in uno.config.ts
Keyframes defined: `loader-in`, `loader-out`, `page-in`, `page-out`, `fade-in`, `fade-in-up/down/left/right`, `scale-in`.

---

## Components

### From `@omnixui/omniui`
```tsx
import { ErrorBoundary, PageLoader, Theme, LiquidGlass, TiltCard,
         FollowField, Alert, AlertTitle, AlertDescription,
         AlertProvider, useAlert, Sticker } from "@omnixui/omniui";
```

| Component | Purpose |
|-----------|---------|
| `ErrorBoundary` | Catches render errors, shows fallback |
| `PageLoader` | Loading overlay with canvas animation |
| `PageLoaderSignal` | Signals when page is ready |
| `Theme` | Dark/light toggle button |
| `LiquidGlass` | Glassmorphism wrapper (backdrop-blur) |
| `TiltCard` | 3D tilt on mouse hover (perspective transform) |
| `FollowField` | Children follow cursor with magnetic effect |
| `Alert` | Toast notification with swipe-to-dismiss |
| `AlertProvider` | Context provider for `useAlert()` |
| `useAlert` | Hook: `{ show: (msg) => void }` |
| `Sticker` | Lottie animation (gzip JSON via fflate) |

### Alert System
```tsx
// Wrap app in AlertProvider (already in index.tsx)
const { show } = useAlert();
show({ variant: 'success', title: 'Done', description: 'Saved!', time: 3000 });
// Variants: 'default' | 'danger' | 'success' | 'warning'
// Supports touch swipe gestures to dismiss
```

### FollowField (Magnetic Cursor)
```tsx
<FollowField class="cursor-none">
  <div class="follow" data-magnetic="0.12">Follows cursor</div>
  <div class="follow" data-magnetic="0.3">Faster follow</div>
</FollowField>
```

### Sticker (Lottie)
```tsx
<Sticker src="/assets/anim.json.gz" loop={true} class="size-20" />
// File must be gzip-compressed Lottie JSON
```

---

## Styling Conventions

- `class` not `className` (Preact)
- UnoCSS utilities = TailwindCSS names (`flex`, `gap-4`, `text-accent`, `rounded-2xl`)
- Theme via CSS vars: `var(--bg)`, `var(--text)`, `var(--text-muted)`, `var(--border)`, `var(--bg-card)`
- Icons: `i-solar-{name}-bold` or `i-solar-{name}-linear`
- Responsive: `md:`, `lg:` prefixes work as in Tailwind
- Arbitrary values: `w-[calc(100%-2rem)]`, `bg-[#8040ff]`, `shadow-[0_0_20px_rgba(0,0,0,0.5)]`

---

## Import Aliases

- `@/` → `app/` AND `public/` (e.g., `@/components/Alert` resolves to `public/components/Alert.tsx`)
- `#/` → project root
- `virtual:uno.css` → UnoCSS (auto-injected in dev, bundled in build)
- `virtual:routes` → auto-generated route map (`pages` + `layouts` objects)
- Relative `./server` → your `app/server.ts` (RSC functions)

---

## Config (`omniui.config.ts`)

Parsed by regex — keep it simple:
```ts
const config = {
  baseUrl: "http://localhost:8080",
  port: 8080,
  upnp: false,       // Windows UPnP port forwarding
  local: false,       // true = bind 127.0.0.1
  browser: true,      // auto-open browser
  robots: { crawler: 2, disallow: ["/api/*"], ignore: ["/api/*"] },
  i18n: { defaultLocale: "en", locales: ["en", "ru"], cookie: "locale" },
};
export default config;
```

---

## Adding a Page

1. Create `app/<route>/page.tsx`
2. Export default component
3. Done — auto-routed

```tsx
// app/blog/page.tsx
export default function Blog() {
  return <div class="p-10">Blog</div>;
}
```

## Adding a Layout

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({ children }: { children: any }) {
  return <div class="flex"><Sidebar />{children}</div>;
}
```

## Adding API Routes

```tsx
// app/api.routes.ts
import { Elysia } from 'elysia';
export default new Elysia({ prefix: '/api' })
  .get('/hello', () => ({ message: 'hi' }));
```

## Adding Middleware

```ts
// middleware.ts
import { Elysia } from 'elysia';
export default new Elysia()
  .onBeforeHandle(({ path }) => { console.log(path); });
```

---

## SEO per Page

Use `Head` component to set meta tags per page:

```tsx
import { Head } from "@omnixui/omniui";

export default function About() {
  return <>
    <Head title="About Us" description="We build things" image="/og/about.png" />
    <div>About page</div>
  </>;
}
```

Head props: `title`, `description`, `image`, `url`, `type`, `robots`.
Sets both `<meta>` OG tags and Twitter cards. Only runs on client (returns null on server).

---

## i18n (Translations)

1. Configure locales in `omniui.config.ts`:
```ts
i18n: { defaultLocale: "en", locales: ["en", "ru"], cookie: "locale" }
```

2. Add JSON files in `locales/`:
```json
// locales/en.json
{ "nav": { "home": "Home" } }
// locales/ru.json
{ "nav": { "home": "Главная" } }
```

3. Use in components:
```tsx
import { useI18n } from "@omnixui/omniui";
function Nav() {
  const { t, locale } = useI18n();
  return <a href="/">{t('nav.home')}</a>;
}
```

Locale detection: URL prefix → Accept-Language header → cookie → default.
Nested keys flatten to dot notation: `{ "nav": { "home": "Hi" } }` → `t('nav.home')`.
Params: `t('greeting', { name: 'World' })` replaces `{name}` in `"Hello {name}!"`.

---

## Page Transitions

The `PageLoader` component shows a canvas animation while pages load:

```tsx
// Already configured in app/index.tsx
<PageLoader fallback={<FallbackPage />} duration={1000}>
  {/* pages render here */}
</PageLoader>
```

- `FallbackPage` (in `_static/Fallback.tsx`) — canvas particle animation
- `PageLoaderSignal` — placed inside pages to signal when content is ready
- `duration` — minimum display time in ms (default 1000)
- Transition: fade out overlay when signal fires + duration elapsed

---

## Fonts (Local Processing)

UnoCSS web fonts are processed locally (no external requests in production):

```ts
// uno.config.ts
presetWebFonts({
  fonts: { unbounded: 'Unbounded' },
  processors: createLocalFontProcessor({
    fontAssetsDir: './public/assets/fonts',
    fontServeBaseUrl: '/assets/fonts',
  })
})
```

- First build downloads fonts → saves as `.woff2` in `public/assets/fonts/`
- Subsequent builds use cached local files
- Font CSS: `font-unbounded` class (auto-generated by UnoCSS)

---

## Vercel Deployment

Project is Vercel-ready. `vercel.json` handles:
- Static asset caching (1 year for fonts)
- SPA rewrites for client-side routing
- API function timeout (10s)

```bash
npm i -g vercel && vercel    # deploy
```

---

## Server Components (RSC)

Mark file with `'use server'`. Export async functions. They run on server via HTTP POST.

```tsx
// app/server.ts
'use server';
export async function getData() { return { value: 42 }; }

// app/page.tsx
import { getData } from './server';
const data = await getData(); // POST to /_bun/rsc
```

**This file is YOUR code, not the framework's. Delete it if not needed.**
If deleted, remove related imports and components from pages.

---

## Important Pitfalls

1. **`class` not `className`** — Preact convention
2. **Config is regex-parsed** — no imports, no computed values in `omniui.config.ts`
3. **`app/_static/` not routed** — use for error pages, hidden components
4. **UnoCSS ≠ Tailwind** — similar but not identical. Check UnoCSS docs for edge cases
5. **Sticker needs gzip** — Lottie JSON must be compressed with gzip
6. **FollowField children need `.follow` or `data-magnetic`** — otherwise they don't move
7. **Alert needs AlertProvider** — wrap app in `<AlertProvider>` (already done in index.tsx)
8. **Server timeout** — always use timeout when testing server startup in automation
9. **Build reads library server** — `omniui build` bundles the framework's `src/server.ts`, not yours
10. **Theme transition** — add `html.theme-transition` class for smooth theme switching
11. **`@/` maps to BOTH `app/` and `public/`** — if both have same-named file, resolution order matters
12. **Head only works on client** — returns null during SSR, sets `document.title` directly
13. **`virtual:routes` is generated at build time** — don't import it in server code
14. **Font cache** — first build downloads fonts, cached in `node_modules/.cache/unocss/fonts/`
15. **i18n keys are flat** — nested JSON becomes dot notation: `{ "a": { "b": "x" } }` → `t('a.b')`

---

## File Naming

- `page.tsx` — creates a route
- `layout.tsx` — wraps child routes
- `_prefix` — excluded from routing
- `server.ts` — YOUR server functions (optional)
- `api.routes.ts` — Elysia API plugin
- `[param]` — dynamic route segment
- `[...all]` — catch-all route

---

## Docs System

Markdown files in `docs/` are served via `/api/docs` endpoint and rendered client-side:

1. `api.routes.ts` collects all `docs/*.md` files, parses frontmatter
2. `docs/[slug]/page.tsx` fetches `/api/docs`, renders with `marked`
3. Sidebar built from `docs/SUMMARY.md` (markdown link list)
4. HTML sanitized (strips `<script>`, `<iframe>`, event handlers)

Frontmatter format:
```yaml
---
section: Core
title: Page Title
description: Short description
created: 2026-06-14
edited: 2026-06-14
---
```

---

## JSX Config (`bunfig.toml`)

Bun is configured for Preact JSX at runtime level:
```toml
[jsx]
jsx = "preact"
jsxImportSource = "preact"
runtime = "automatic"
```

This means you don't need to import `React` or `h` — JSX just works with Preact.

---

## Known Security Limitations

The framework has known security issues (tracked in STEPS.md):

1. **RSC endpoint** — `/_bun/rsc` does dynamic `import()` with path containment check.
   Not safe for multi-tenant or untrusted code scenarios.
2. **Config parsing** — `omniui.config.ts` is parsed with regex + `new Function()`.
   Don't put untrusted code in config.

### Dependency Security Notes

These npm audit warnings are expected behavior, not vulnerabilities:
- **Obfuscated code** (css-tree, preact, strtok3, node-fetch-native) — minified production bundles, false positives
- **Uses eval** (oxc-parser, @emnapi/core, lottie-web, elysia) — WASM runtime bridging and animation rendering, legitimate use cases
- **Wildcard dependency** (@iconify-json/solar → @iconify/types) — pinned in template

These are acceptable for single-developer projects but should be addressed for production with multiple contributors.

---

## Dependency Notes

- `marked` — markdown parser (used in docs rendering)
- `fflate` — gzip compression/decompression (used in Sticker for Lottie)
- `lottie-web` — Lottie animation renderer (used in Sticker)
- `lightningcss` — CSS transformation/minification (used in UnoCSS plugin)
- `wouter-preact` — lightweight client-side router
- `@iconify-json/solar` — Solar icon set (1500+ icons)
