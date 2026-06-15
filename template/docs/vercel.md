---
section: Advanced
title: Vercel Deploy
description: Vercel-ready out of the box
created: 2026-06-14
edited: 2026-06-14
---

## Quick Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## Configuration

The `vercel.json` handles:

- Static asset caching (1 year for fonts)
- SPA rewrites for client-side routing
- API function timeout configuration

```json
{
  "version": 2,
  "installCommand": "bun install",
  "buildCommand": "bun bundle",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/app/index.html" }
  ]
}
```

## Environment Variables

Set environment variables in Vercel dashboard or `.env` file:

```bash
NODE_ENV=production
```
