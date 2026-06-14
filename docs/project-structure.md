---
section: Getting Started
title: Project Structure
description: Directory layout and key files overview
created: 2026-06-14
edited: 2026-06-14
---

```
omniui/
├── app/                    # Pages and routes
│   ├── page.tsx           # / (home)
│   ├── layout.tsx         # Root layout
│   ├── index.tsx          # Client entry
│   ├── index.html         # HTML template
│   ├── api.routes.ts      # API endpoints
│   ├── _static/           # Error pages
│   │   ├── 404.tsx
│   │   ├── Fallback.tsx
│   │   └── Fault.tsx
│   └── docs/
│       └── page.tsx       # /docs
├── src/
│   ├── server.ts          # Elysia server
│   ├── plugins/           # Bun plugins
│   │   ├── router.plugin.ts
│   │   ├── rsc.plugin.ts
│   │   ├── directives.plugin.ts
│   │   └── unocss.plugin.ts
│   ├── components/        # Core components
│   └── libs/              # Utilities
├── public/
│   └── components/        # UI components
├── docs/                  # Documentation (Markdown)
├── uno.config.ts          # UnoCSS config
├── omniui.config.ts       # Framework config
└── vercel.json            # Vercel config
```

## Key Files

- **`app/page.tsx`** — Home page component
- **`app/api.routes.ts`** — API route definitions
- **`src/server.ts`** — Elysia server setup
- **`uno.config.ts`** — UnoCSS configuration
- **`omniui.config.ts`** — Framework configuration
