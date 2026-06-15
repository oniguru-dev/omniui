---
section: Components
title: FollowField
description: Container where child elements follow the cursor
created: 2026-06-14
edited: 2026-06-14
---

## Usage

```tsx
import { FollowField } from "@/components/FollowField";

<FollowField class="rounded-2xl h-96">
  <div class="follow" data-magnetic="0.06">I follow cursor</div>
  <div class="follow absolute top-4 right-4 size-3 rounded-full bg-accent/40" data-magnetic="0.03" />
  <div>I stay still</div>
</FollowField>
```

Any element with `follow` class or `data-magnetic` attribute moves with the cursor. Speed is set via `data-magnetic`.

## How It Works

`FollowField` tracks cursor position and pulls nearby followers within the container bounds. Each follower lerp towards the cursor at its own speed. Force fades with distance.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `any` | — | Content, followers marked with `.follow` or `data-magnetic` |
| `class` | `string` | `''` | Additional CSS classes |

## Follower Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data-magnetic` | `number` | `0.12` | Constant speed in px/frame. Accelerates over first 6 frames |
| `class="follow"` | — | — | Marks element as follower |
