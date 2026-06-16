import { defineConfig } from 'unocss';
import { presetWind4, presetIcons, presetTypography, presetWebFonts } from 'unocss';
import { createLocalFontProcessor } from '@unocss/preset-web-fonts/local';

export default defineConfig({
  presets: [
    presetWind4(), presetIcons(),
    presetTypography(), presetWebFonts({
      extendTheme: true, provider: 'coollabs',
      fonts: { unbounded: 'Unbounded' },
      processors: createLocalFontProcessor({
        cacheDir: 'node_modules/.cache/unocss/fonts',
        fontAssetsDir: './public/assets/fonts',
        fontServeBaseUrl: '/assets/fonts',
      })
    }),
  ],

  theme: { colors: {
    accent: "#8040ff"
  }, },

  shortcuts: [
    // noise
    ['noise', `mix-blend-soft-light
      bg-[url(./assets/materials/noise.png)]
    `],

    // glow effect
    [/^glow-(?:(\d+)-)?(.+)$/, ([, blur = '8', color]) => `
      shadow-[0_0_${blur}px_var(--un-shadow-color)] shadow-${color}
    `],

    // scrollbar modifier
    ['scrollbar', `
      [&::-webkit-scrollbar]:(size-2)
      [&::-webkit-scrollbar-track]:(bg-transparent)
      [&::-webkit-scrollbar-thumb]:(bg-accent rounded-sm)
    `],
    ['scrollbar-thin', `
      [&::-webkit-scrollbar]:(size-1.5)
    `],
    ['scrollbar-none', `
      [&::-webkit-scrollbar]:display-none
      [scrollbar-width:none]
    `],

    // scrollbar color
    [/^scrollbar-thumb-(.+)$/, ([, color]) => `
      [&::-webkit-scrollbar-thumb]:bg-${color}
    `],
    [/^scrollbar-track-(.+)$/, ([, color]) => `
      [&::-webkit-scrollbar-track]:bg-${color}
    `],
  ],

  cli: { entry: [{
    patterns: ['app/**/*.{ts,tsx,js,jsx}', 'app/**/*.html'],
    outFile: 'app/index.css', splitCss: 'multi'
  }]},
})
