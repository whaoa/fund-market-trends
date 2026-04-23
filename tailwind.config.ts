import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/routes/**/*.tsx',
    './src/components/**/*.tsx',
  ],
  theme: {
    extend: {
      colors: {
        t: {
          primary: 'rgb(var(--color-text-primary))',
          secondary: 'rgb(var(--color-text-secondary))',
          tertiary: 'rgb(var(--color-text-tertiary))',
        },

        g: {
          'bg': 'rgb(var(--color-background))',
          'bg-s': 'rgb(var(--color-background-secondary))',
          'border': 'rgb(var(--color-border))',
        },
      },
    },
  },
} satisfies Config;
