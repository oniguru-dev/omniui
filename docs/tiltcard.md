---
section: Components
title: Tilt Card
description: 3D tilt effect on mouse movement with perspective transform
created: 2026-06-14
edited: 2026-06-14
---

## Usage

```tsx
import { TiltCard } from "@/components/TiltCard";

<TiltCard class="rounded-2xl">
  <div class="p-8">Hover me for 3D effect</div>
</TiltCard>
```

## How It Works

Tracks mouse position relative to the card center and applies `perspective(1000px) rotateX() rotateY()` transforms. Maximum tilt is ±3 degrees with smooth easing on mouse leave.

## Props

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ComponentChildren` | Card content |
| `class` | `string` | Additional CSS classes |
