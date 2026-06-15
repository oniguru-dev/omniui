---
section: Components
title: Alert
description: Toast notification system with swipe gestures and auto-dismiss
created: 2026-06-14
edited: 2026-06-14
---

## Usage

```tsx
import { useAlert } from "@/components/AlertContext";

function MyComponent() {
  const { addAlert } = useAlert();

  return (
    <button onClick={() => addAlert({
      variant: "success",
      title: "Done!",
      description: "Action completed",
      time: 3000,
    })}>
      Show Alert
    </button>
  );
}
```

## Setup

Wrap your app with `AlertProvider`:

```tsx
import { AlertProvider } from "@/components/AlertContext";

<AlertProvider>
  {children}
</AlertProvider>
```

## Variants

| Variant | Color | Icon |
|---------|-------|------|
| `default` | Accent | Info circle |
| `success` | Green | Check circle |
| `warning` | Orange | Triangle |
| `danger` | Red | Danger circle |

## Features

- Auto-dismiss with configurable timeout
- Swipe-to-dismiss on touch devices
- Pause on hover
- Maximum 6 alerts (2 on mobile)
- Glassmorphism styling with LiquidGlass
