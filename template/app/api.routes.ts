/**
 * omniui — Lightweight UI Framework
 * Built with Preact & UnoCSS | @omnidev
 */

'use server';
import { Elysia } from 'elysia';

import { readdir, stat } from 'fs/promises';
import { join } from 'path';

const DOCS_DIR = join(process.cwd(), 'docs');

function parseFront(content: string): {
  meta: Record<string, string>; body: string
} {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };

  const meta: Record<string, string> = {};

  for (const line of match[1]!.split('\n')) {
    const idx = line.indexOf(':'); if (idx > 0)
      meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }

  return { meta, body: match[2]! };
}

async function collectDocs(dir: string, prefix = '') {
  const docs: Record<string, { title: string; content: string; meta: Record<string, string> }> = {};

  for (const entry of await readdir(dir)) {
    if (entry === 'SUMMARY.md') continue;
    const path = join(dir, entry);
    const stats = await stat(path);

    if (stats.isDirectory()) {
      Object.assign(docs, await collectDocs(
        path, prefix ? `${prefix}/${entry}` : entry
      ));
    } else if (entry.endsWith('.md')) {
      const raw = await Bun.file(path).text();
      const { meta, body } = parseFront(raw);

      const id = prefix
        ? `${prefix}/${entry.replace('.md', '')}`
        : entry.replace('.md', '');

      const title = meta.title || body.split('\n')
        .find(line => line.startsWith('# '))?.slice(2)
        || id.replace(/-/g, ' ');

      docs[id] = { title, content: body, meta };
    }
  }

  return docs;
}


/**
 * Формат версии API:
 * YYYY.MM-TNN.B
 *
 * Пример версии:
 * 26.01-r01.1
 * │  │   │  └─ номер билда
 * │  │   └──── тип + день
 * │  └──────── месяц
 * └─────────── год
 *
 * Расшифровка:
 * 26      → 2026 год
 * 01      → январь
 * r01     → release, 1 число
 * .1      → билд 1
 *
 * Типы версий:
 * a → alpha      (альфа)
 * b → beta       (бета)
 * c → candidate  (кандидат)
 * r → release    (релиз)
 * d → dev        (разработка)
 *
 * Примеры:
 * 26.05-a01.2 → alpha, 1 мая, билд 2
 * 26.05-b14.1 → beta, 14 мая, билд 1
 * 26.05-c20.3 → release candidate, 20 мая, билд 3
 * 26.05-r03.1 → stable release, 3 мая, билд 1
 */

export const apiRoutes = new Elysia({ prefix: '/api' })

  .get('/docs', async () => {
    const summaryFile = Bun.file(join(DOCS_DIR, 'SUMMARY.md'));
    const summary = await summaryFile.exists() ? await summaryFile.text() : '';
    const docs = await collectDocs(DOCS_DIR); return { summary, docs };
  })

  .all('/*', ({ status }) => status(404))
