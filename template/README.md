<p align="center">
  <a href="https://github.com/oniguru-dev/omniui">
    <img src="public/assets/icon.svg" alt="Logo" width="80" />
  </a>
</p>

<h1 align="center">{project-name}</h1>

<p align="center">
  Built with <a href="https://github.com/oniguru-dev/omniui">Omni UI</a>
</p>

## Stack

| Layer | Technology |
|-------|-----------|
| Runtime | [Bun](https://bun.sh) |
| Server | [Elysia.js](https://elysiajs.com) |
| UI | [Preact](https://preactjs.com) |
| CSS | [UnoCSS](https://unocss.dev) (TailwindCSS-compatible) |
| Language | TypeScript (strict) |

## Getting Started

```bash
# Install dependencies
bun install

# Start dev server
bun dev
```

Open [http://localhost:8080](http://localhost:8080).

## Project Structure

```
app/
  page.tsx              ← Home (/)
  layout.tsx            ← Root layout
  server.ts             ← Server functions (optional)
  api.routes.ts         ← API endpoints (/api/*)
  theme.css             ← CSS variables (dark/light)
  docs/                 ← /docs, /docs/:slug
public/
  assets/               ← Images, fonts, icons
  components/           ← Shared components
docs/                   ← Markdown documentation
locales/                ← i18n translations
middleware.ts           ← Server middleware
omniui.config.ts        ← Framework config
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start dev server with hot reload |
| `bun build` | Production build → `dist/` |
| `bun start` | Run production server |
| `bun preview` | Preview production build |
| `bun clean` | Remove `dist/` |

## Components

```tsx
import { LiquidGlass, TiltCard, FollowField, Alert, Sticker, Theme } from "@omnixui/omniui";
```

| Component | Description |
|-----------|-------------|
| `LiquidGlass` | Glassmorphism with backdrop-blur |
| `TiltCard` | 3D tilt on mouse hover |
| `FollowField` | Children follow cursor with magnetic effect |
| `Alert` | Toast notifications with swipe-to-dismiss |
| `Sticker` | Lottie animations (gzip JSON) |
| `Theme` | Dark/light theme toggle |

## Adding Pages

Create a file in `app/` — it becomes a route automatically:

```tsx
// app/about/page.tsx → /about
export default function About() {
  return <div class="p-10">About us</div>;
}
```

## UnoCSS

TailwindCSS-compatible utility classes. Icons via Solar icon set:

```tsx
<div class="flex gap-4 items-center">
  <div class="i-solar-star-bold text-accent" />
  <span class="text-lg font-bold">Hello</span>
</div>
```

Custom shortcuts: `liquid-glass`, `noise`, `gradient-root`, `reveal`, `glow-{n}-{color}`.

## Learn More

- [Documentation](https://github.com/oniguru-dev/omniui)
- [UnoCSS Docs](https://unocss.dev)
- [Preact Docs](https://preactjs.com/guide/v10/getting-started)
- [Elysia Docs](https://elysiajs.com)
