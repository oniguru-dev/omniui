import { defineConfig } from 'unocss';
import { presetWind4, presetIcons, presetTypography } from 'unocss';

export default defineConfig({
  presets: [
    presetWind4(),
    presetIcons(),
    presetTypography(),
  ],
  theme: { colors: { accent: "#8040ff" } },
});
