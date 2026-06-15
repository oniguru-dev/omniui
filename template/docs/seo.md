---
section: Advanced
title: SEO Optimization
description: Auto-generated sitemap.xml and robots.txt
created: 2026-06-14
edited: 2026-06-14
---

`sitemap.xml` and `robots.txt` are auto-generated during build.

## Configuration

```ts
// omniui.config.ts
const config = {
  baseUrl: "https://example.com",
  robots: {
    crawler: 2,  // rate-limit (seconds)
    disallow: ["/api/*"],
    ignore: ["/api/*"],  // excluded from sitemap
  }
};
```

## Sitemap

Generated from all `page.tsx` files in `app/`. Static routes get priority 1.0, dynamic routes get 0.6.

## Robots.txt

```txt
User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml
```

## Custom Rules

Add custom disallow rules in `omniui.config.ts`:

```ts
robots: {
  disallow: ["/admin/*", "/api/*"],
}
```
