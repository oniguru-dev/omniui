<p align="center">
  <a href="https://github.com/oniguru-dev/omniui">
    <img src="https://raw.githubusercontent.com/oniguru-dev/omniui/main/public/assets/icon.svg" alt="Omni UI" width="128" />
  </a>
</p>

<h1 align="center">Omni UI</h1>

<p align="center">
  Lightweight UI framework for Bun with file routing, server components, and UnoCSS.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@omnixui/omniui"><img src="https://img.shields.io/npm/v/@omnixui/omniui" alt="npm version" /></a>
  <a href="https://github.com/oniguru-dev/omniui/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License" /></a>
  <a href="https://bun.sh"><img src="https://img.shields.io/badge/Bun-%23000000.svg?logo=bun&logoColor=white" alt="Bun" /></a>
</p>

## Install

```bash
bun add @omnixui/omniui
```

## Quick Start

```bash
bunx omniui create my-app
cd my-app
bun dev
```

## Features

- **File Routing** — pages are files, routes are automatic
- **Server Components** — `'use server'` for server-side logic
- **UnoCSS** — instant atomic CSS engine
- **Asset Pipeline** — optimized images, video, audio out of the box
- **Page Transitions** — smooth canvas-based navigation
- **TypeScript** — strict mode, full type safety

## Components

| Component | Description |
|-----------|-------------|
| `LiquidGlass` | Glassmorphism with backdrop-blur |
| `TiltCard` | 3D tilt effect on mouse hover |
| `FollowField` | Children follow cursor movement |
| `Alert` | Toast notifications with swipe gestures |
| `Sticker` | Lottie animations with gzip decompression |
| `Gradient` | Interactive gradient following mouse |
| `Theme` | Dark/light theme toggle |

```tsx
import { LiquidGlass, TiltCard, Theme } from "@omnixui/omniui";

function App() {
  return (
    <Theme>
      <LiquidGlass class="p-8">
        <TiltCard>
          <h1>Omni UI</h1>
        </TiltCard>
      </LiquidGlass>
    </Theme>
  );
}
```

## Documentation

Visit the [GitHub repo](https://github.com/oniguru-dev/omniui) for documentation and examples.

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

## License

[MIT](LICENSE) © [oniguru-dev](https://github.com/oniguru-dev)