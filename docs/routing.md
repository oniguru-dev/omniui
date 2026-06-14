---
section: Core
title: File-based Routing
description: Pages are files, routes are automatic
created: 2026-06-14
edited: 2026-06-14
---

Every `page.tsx` file becomes a route automatically.

## Route Mapping

| File Path | Route |
|-----------|-------|
| `app/page.tsx` | `/` |
| `app/about/page.tsx` | `/about` |
| `app/docs/page.tsx` | `/docs` |
| `app/blog/[slug]/page.tsx` | `/blog/:slug` |
| `app/shop/[...all]/page.tsx` | `/shop/*` |

## Dynamic Routes

Use square brackets for dynamic segments:

```tsx
// app/blog/[slug]/page.tsx
export default function BlogPost({ params }: any) {
  return <h1>Post: {params.slug}</h1>;
}
```

Catch-all routes use spread syntax:

```tsx
// app/shop/[...all]/page.tsx
export default function Shop({ params }: any) {
  // params.all = ["shoes", "nike"] for /shop/shoes/nike
  return <div>{params.all.join("/")}</div>;
}
```

## How It Works

The `router.plugin.ts` scans the `app/` directory for `page.tsx` files and generates a virtual module `virtual:routes` that maps file paths to route patterns.

- Files starting with `_` are excluded (like `_static/`)
- Nested directories create nested routes
- `[param]` becomes `:param` in the route pattern
- `[...all]` becomes `*` (catch-all)
