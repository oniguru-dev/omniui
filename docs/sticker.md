---
section: Components
title: Sticker
description: Lottie animation component with gzip decompression
created: 2026-06-14
edited: 2026-06-14
---

## Usage

```tsx
import { Sticker } from "@/components/Sticker";

<Sticker
  src="/assets/stickers/success.sticker"
  loop={true}
  class="size-32"
/>
```

## How It Works

1. Fetches the `.sticker` file (gzipped Lottie JSON)
2. Decompresses using `fflate`
3. Renders animation using `lottie-web` with canvas renderer

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | — | Path to .sticker file |
| `loop` | `boolean` | `true` | Loop animation |
| `class` | `string` | `''` | Container CSS classes |
