---
section: Advanced
title: Build Process
description: Two-phase build system with asset optimization
created: 2026-06-14
edited: 2026-06-14
---

The build system runs two phases:

## Phase 1: Frontend

Bundles `app/` with `Bun.build`, target: browser.

```ts
const client = await Bun.build({
  entrypoints: ['app/index.html'],
  outdir: 'dist/app',
  splitting: true,
  minify: { whitespace: true, syntax: true },
  target: 'browser',
  format: 'esm',
  plugins: [unocss, router, directives, rsc],
})
```

## Phase 2: Backend

Bundles `src/server.ts`, target: bun.

```ts
const server = await Bun.build({
  entrypoints: ['src/server.ts'],
  outdir: 'dist/src',
  minify: { whitespace: true, syntax: true },
  target: 'bun',
  format: 'cjs',
  define: { "__bundle__": "true" },
})
```

## Asset Optimization

After bundling, the asset optimizer runs:

| Tool | Format | Optimization |
|------|--------|-------------|
| oxipng | PNG | Lossless compression |
| rimage | JPEG/WebP | Quality 80%, strip metadata |
| gifski | GIF | Quality 80% |
| ffmpeg | Video/Audio | Transcode, CRF 20 |

## CLI Options

```bash
# Build with optimization
bun bundle

# Skip specific optimizations
bun bundle --ignore png,gif,video
```
