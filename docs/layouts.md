---
section: Core
title: Nested Layouts
description: Layout files wrap pages at their route level
created: 2026-06-14
edited: 2026-06-14
---

Layout files wrap pages at their route level. Layouts persist across navigations and don't re-render.

## Usage

```tsx
// app/layout.tsx — wraps ALL pages
export default function RootLayout({ children }: any) {
  return <>{children}</>;
}

// app/docs/layout.tsx — wraps /docs/* pages
export default function DocsLayout({ children }: any) {
  return (
    <div class="flex">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
```

## Nesting

Layouts are nested automatically based on directory structure:

- `app/layout.tsx` wraps everything
- `app/docs/layout.tsx` wraps `/docs/*`
- `app/blog/layout.tsx` wraps `/blog/*`

Child layouts receive the page content as `children`.
