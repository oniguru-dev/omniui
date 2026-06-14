---
section: Core
title: Server Components
description: Add 'use server' to mark functions as server-only
created: 2026-06-14
edited: 2026-06-14
---

Add `'use server'` at the top of a file to mark all exported functions as server-side. They're called via fetch from the client.

## Usage

```tsx
// app/api.routes.ts
'use server'

import { Elysia } from 'elysia';

export const apiRoutes = new Elysia({ prefix: '/api' })
  .get('/hello', () => ({ message: 'Hello from server!' }))
  .all('/*', ({ status }) => status(404))
```

## How It Works

The `directives.plugin.ts` detects the `'use server'` directive and generates client-side proxy functions. When a client calls a server function, it makes a POST request to `/_bun/rsc` with the module path, function name, and arguments.

The server then dynamically imports the module, calls the function, and returns the result.

## RSC Endpoint

The server exposes a single endpoint for all server component calls:

```
POST /_bun/rsc
Body: { module: string, function: string, args: any[] }
Response: { result: any }
```
