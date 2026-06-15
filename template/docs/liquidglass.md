---
section: Components
title: Liquid Glass
description: Glassmorphism component with backdrop-blur and subtle border effects
created: 2026-06-14
edited: 2026-06-14
---

## Usage

```tsx
import { LiquidGlass } from "@/components/LiquidGlass";

<LiquidGlass class="p-8 rounded-2xl">
  <h2>Glass content</h2>
</LiquidGlass>
```

## Props

Accepts all standard `div` attributes plus children.

## Styling

The component applies:
- `background: rgba(255,255,255,0.04)`
- `backdrop-filter: blur(4px)`
- `border: 1px solid rgba(255,255,255,0.06)`
- `box-shadow: inset 0 1.1px rgba(255,255,255,0.2), inset 0 -1.1px rgba(255,255,255,0.05)`
