/**
 * omniui — Lightweight UI Framework
 * Built with Preact & UnoCSS | @omnidev
 */

import fs from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "url";
import { existsSync, readFileSync } from "fs";
import { red, yellow, green } from "colorette";

// plugins
import { plugin as router } from '../plugins/router.plugin';
import { plugin as directives } from '../plugins/directives.plugin';
import { plugin as rsc } from '../plugins/rsc.plugin';
import { plugin as unocss } from '../plugins/unocss.plugin';

import { newSitemap } from "../libs/sitemap";
import { newRobots } from "../libs/robots";

const __dirname = dirname(fileURLToPath(import.meta.url));
const cwd = process.cwd();

function loadConfig() {
  const configPath = join(cwd, 'omniui.config.ts');
  if (!existsSync(configPath)) return { port: 8080, local: false, browser: true, upnp: false, baseUrl: 'http://localhost:8080', robots: { crawler: 2, disallow: ['/api/*'], ignore: ['/api/*'] } };
  const content = readFileSync(configPath, 'utf-8');
  const match = content.match(/const\s+config\s*=\s*(\{[\s\S]*?\});/);
  if (!match) return { port: 8080, local: false, browser: true, upnp: false, baseUrl: 'http://localhost:8080', robots: { crawler: 2, disallow: ['/api/*'], ignore: ['/api/*'] } };
  try { return eval('(' + match[1] + ')'); } catch { return { port: 8080, local: false, browser: true, upnp: false, baseUrl: 'http://localhost:8080', robots: { crawler: 2, disallow: ['/api/*'], ignore: ['/api/*'] } }; }
}

const config = loadConfig();

const argv = Bun.argv.slice(2);
const idx = argv.findIndex(x => x === "--ignore" || x === "-i");
const args = (idx !== -1 ? argv[idx + 1] ?? "" : "").toLowerCase();

const doOxiPNG    = !args.includes("png");
const doRustImage = !args.includes("jpeg") && !args.includes("webp");
const doGIFski    = !args.includes("gif");
const doVideo     = !args.includes("video");
const doAudio     = !args.includes("audio");

const BIN_DIR = join(import.meta.dir, '..', '..', 'bin');

async function resolve(name: string): Promise<string | null> {
  const ext = process.platform === 'win32' ? '.exe' : '';
  const candidates = ext ? [`${name}.exe`, name] : [name];
  for (const file of candidates) {
    const path = join(BIN_DIR, file);
    try { await fs.access(path); return path; } catch {}
  }
  return null;
}

const missing = new Set<string>();

async function requireBinary(name: string): Promise<string | null> {
  const bin = await resolve(name);
  if (!bin) { missing.add(name); return null; }
  return bin;
}

try {
  const start = Bun.nanoseconds();

  console.log("⌚ Cleaning previous builds...");
  await fs.rm(join(cwd, 'dist'), { recursive: true, force: true });

  console.log(yellow("⚡ Building frontend... [1/2]"));
  const client = await Bun.build({
    entrypoints: [join(cwd, 'app/index.html')], outdir: join(cwd, 'dist/app'),
    splitting: true, minify: { whitespace: true, syntax: true },
    target: 'browser', format: 'esm', plugins: [unocss, router, directives, rsc],
  })
  if (!client.success) throw new AggregateError(client.logs, "❌ Client-side build failed");

  console.log(yellow("⚡ Building backend... [2/2]"));
  const server = await Bun.build({
    entrypoints: [join(cwd, 'src/server.ts')], outdir: join(cwd, 'dist/src'),
    minify: { whitespace: true, syntax: true },
    target: 'bun', format: 'cjs',
    define: { "__bundle__": "true" },
  })
  if (!server.success) throw new AggregateError(server.logs, "❌ Server-side build failed");

  console.log("📂 Copying static assets...");
  for await (const file of new Bun.Glob('public/**/*').scan({ cwd }))
    await Bun.write(join(cwd, `dist/${file}`), Bun.file(join(cwd, file)));

  console.log("🎴 Optimizing assets...");
  const assets = join(cwd, "dist/public/assets");
  const io = { stdout: "inherit" as const, stderr: "inherit" as const };
  const tmp = join(cwd, "dist/tmp");
  await fs.mkdir(tmp, { recursive: true });

  if (doOxiPNG) {
    const bin = await requireBinary("oxipng"); if (bin) { try {
      await Bun.spawn([bin, "-o", "0", "-s", "-r", assets], io).exited;
    } catch {} }
  }

  if (doRustImage) {
    const bin = await requireBinary("rimage"); if (bin) { try {
      for await (const file of new Bun.Glob(`${assets}/**/*.{jpg,jpeg}`).scan())
        await Bun.spawn([bin, "jpeg", file, "--strip", "--quality", "80"], io).exited;
      for await (const file of new Bun.Glob(`${assets}/**/*.webp`).scan())
        await Bun.spawn([bin, "webp", file, "--strip", "--quality", "80"], io).exited;
    } catch {} }
  }

  if (doGIFski) {
    const bin = await requireBinary("gifski"); if (bin) { try {
      for await (const file of new Bun.Glob(`${assets}/**/*.gif`).scan()) {
        const filename = file.split(/[\\/]/).pop()!;
        const path = `${tmp}/${filename}`;
        await Bun.spawn([bin, "-o", path, file, "--quality", "80"], io).exited;
        await fs.rename(path, file);
      }
    } catch {} }
  }

  const ffmpeg = await requireBinary("ffmpeg");

  if (ffmpeg) {
    if (doVideo) { try {
      for await (const file of new Bun.Glob(`${assets}/**/*.{mp4,webm}`).scan()) {
        const filename = file.split(/[\\/]/).pop()!;
        const path = `${tmp}/${filename}`;

        await Bun.spawn([
          ffmpeg, "-y", "-i", file,
          "-preset", "veryfast", "-profile:v", "high", "-crf", "20",
          "-sc_threshold", "0", "-g", "240", "-keyint_min", "240",
          "-level", "4.0", "-pix_fmt", "yuv420p",
          "-movflags", "+faststart", path
        ], io).exited;

        await fs.rename(path, file);
      }
    } catch {} }

    if (doAudio) { try {
      for await (const file of new Bun.Glob(`${assets}/**/*.{mp3,wav,m4a,aac,ogg}`).scan()) {
        const filename = file.split(/[\\/]/).pop()!;
        const path = `${tmp}/${filename}`;

        await Bun.spawn([
          ffmpeg, "-y", "-i", file,
          "-b:a", "112k", "-ac", "2", "-ar", "48000",
          "-movflags", "+faststart", path
        ], io).exited;

        await fs.rename(path, file);
      }
    } catch {} }
  }

  if (missing.size > 0) {
    console.warn(`\n  ${yellow(`⚠  Binaries not found: ${[...missing].join(', ')}`)}`);
    console.log(`  Download them to ${BIN_DIR} for asset optimization.\n`);
  }

  console.log("📡 Generating SEO files...");
  const routes: Array<{ route: string; type: 'static' | 'dynamic' }> = [];

  for await (const file of new Bun.Glob("**/page.{ts,tsx}").scan({ cwd: join(cwd, "app"), onlyFiles: true })) {
    if (file.includes("_")) continue;
    let route = "/" + file.replace(/\\/g, "/");
    route = route.replace(/\/?page\.(ts|tsx)$/, "");
    if (route === "") route = "/";
    route = route.replace(/\[(.*?)\]/g, ":$1");
    routes.push({ route, type: route.includes(":") ? "dynamic" : "static" });
  }

  try {
    await newSitemap(config, join(cwd, "dist/public"), routes);
    await newRobots(config, join(cwd, "dist/public"));
    console.log(green("✔ sitemap.xml & robots.txt generated"));
  } catch (err) {
    console.warn("⚠️ SEO file generation failed:", err);
  }

  const elapsedMs = (Bun.nanoseconds() - start) / 1_000_000;
  process.stdout.write("\r" + " ".repeat(process.stdout.columns || 80) + "\r");
  console.log(green(`✔ Build completed in ${elapsedMs.toFixed(2)}ms`));
} catch (err) {
  console.error(red("❌ Build failed:"), err);
}
