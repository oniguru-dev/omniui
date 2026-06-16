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

  theme: {
    colors: {
      accent: "#8040ff",
    },
    animation: {
      keyframes: {
        'loader-in': '{from{opacity:0}to{opacity:1}}',
        'loader-out': '{from{opacity:1}to{opacity:0}}',
        'page-in': '{from{opacity:0}to{opacity:1}}',
        'page-out': '{from{opacity:1}to{opacity:0}}',
        'fade-in': '{from{opacity:0}to{opacity:1}}',
        'fade-out': '{from{opacity:1}to{opacity:0}}',
        'fade-in-up': '{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}',
        'fade-in-down': '{from{opacity:0;transform:translateY(-24px)}to{opacity:1;transform:translateY(0)}}',
        'fade-in-left': '{from{opacity:0;transform:translateX(-24px)}to{opacity:1;transform:translateX(0)}}',
        'fade-in-right': '{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}',
        'scale-in': '{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}',
      },
    },
  },

  shortcuts: [
    // noise
    ['noise', `mix-blend-soft-light
      bg-[url(./assets/materials/noise.png)]
    `],

    // liquid glass
    ['liquid-glass', `
      bg-white/4 backdrop-blur-md
      border border-white/6
      shadow-[inset_0_1.1px_rgba(255,255,255,.2),inset_0_-1.1px_rgba(255,255,255,.05)]
      relative overflow-hidden
    `],

    // gradient glow
    ['gradient-root', `
      relative overflow-hidden
      before:(content-[''] absolute w-300px h-300px
        left-[calc(var(--gx,50%)-150px)] top-[calc(var(--gy,50%)-150px)]
        bg-[radial-gradient(circle,rgba(128,64,255,.3)_0%,rgba(128,64,255,.1)_30%,transparent_70%)]
        rounded-full pointer-events-none z-0
        transition-[left,top] duration-120ms ease-out)
      children:z-1 relative
    `],

    // overlay transitions
    ['loader-in', 'animate-[loader-in_125ms_ease-out_forwards]'],
    ['loader-out', 'animate-[loader-out_250ms_ease-out_forwards]'],

    // page transitions
    ['page-in', 'animate-[page-in_300ms_ease-out_forwards]'],
    ['page-out', 'animate-[page-out_300ms_ease-out_forwards] absolute inset-0 pointer-events-none'],

    // scroll fade-in animations
    ['fade-in', 'animate-[fade-in_600ms_ease-out_forwards]'],
    ['fade-in-up', 'animate-[fade-in-up_600ms_ease-out_forwards]'],
    ['fade-in-down', 'animate-[fade-in-down_600ms_ease-out_forwards]'],
    ['fade-in-left', 'animate-[fade-in-left_600ms_ease-out_forwards]'],
    ['fade-in-right', 'animate-[fade-in-right_600ms_ease-out_forwards]'],
    ['scale-in', 'animate-[scale-in_600ms_ease-out_forwards]'],

    // scroll trigger — starts hidden, revealed by .visible
    ['reveal', 'opacity-0 translate-y-6'],
    ['reveal-left', 'opacity-0 -translate-x-6'],
    ['reveal-right', 'opacity-0 translate-x-6'],
    ['reveal-scale', 'opacity-0 scale-95'],
    ['visible', 'fade-in-up'],

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
