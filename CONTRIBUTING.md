# Contributing to Omni UI

Thanks for your interest in contributing to Omni UI!

## Getting Started

1. Fork the repository
2. Clone your fork
3. Install dependencies:
   ```bash
   bun install
   ```
4. Start the dev server:
   ```bash
   bun dev
   ```

## Project Structure

```
omniui/
├── src/
│   ├── cli.ts          # CLI entry point
│   ├── server.ts       # Dev/prod server
│   ├── libs/           # Core libraries
│   │   ├── config.ts   # Config loader
│   │   ├── paths.ts    # Path utilities
│   │   ├── robots.ts   # robots.txt generator
│   │   └── sitemap.ts  # sitemap.xml generator
│   ├── plugins/        # Build plugins
│   │   ├── directives.plugin.ts  # 'use server' support
│   │   ├── router.plugin.ts      # File-based routing
│   │   ├── rsc.plugin.ts         # React Server Components
│   │   └── unocss.plugin.ts      # UnoCSS integration
│   └── components/     # Framework components
├── app/                # Demo app (docs site)
├── public/             # Components & assets
├── template/           # Project template (for `omniui create`)
└── docs/               # Documentation source
```

## Development

### Code Style
- TypeScript strict mode
- No comments in code
- Use Preact for components
- Follow existing patterns

### Testing
- Use `bun test` for tests
- Run tests before submitting PR:
  ```bash
  bun test
  ```

### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation
- `refactor:` — code refactoring
- `chore:` — maintenance

## Pull Requests

1. Create a feature branch from `main`
2. Make your changes
3. Ensure all tests pass
4. Submit a PR with clear description

## Issues

- Use GitHub Issues for bug reports
- Include reproduction steps
- Include environment info (`bun omniui info`)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
