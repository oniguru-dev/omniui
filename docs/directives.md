---
section: Core
title: Directives
description: 'use server' and 'use client' directives for RSC
created: 2026-06-14
edited: 2026-06-14
---

Omni UI supports two directives:

## `'use server'`

Marks functions as server-only. The build plugin generates fetch-based proxies for client consumption.

```tsx
'use server'

export async function getUser(id: number) {
  return await db.users.get(id);
}
```

When imported in a client component, `getUser` becomes a remote function call.

## `'use client'`

Marks components as client-only. Used for error boundaries and interactive components that need browser APIs.

```tsx
'use client'

export default function Fault({ error, dismiss }: any) {
  return <div>Error: {error.message}</div>;
}
```
