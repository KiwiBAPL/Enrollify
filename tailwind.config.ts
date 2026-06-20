import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#F7F7F7',
          secondary: '#FFFFFF',
        },
        text: {
          primary: '#0B0B0B',
          secondary: '#43329D',
          muted: '#6F66A8',
        },
        accent: {
          primary: '#43329D',
          mint: '#AEE3C8',
          lavender: '#8D82CE',
          softPurple: '#A49BD4',
        },
        stroke: {
          primary: '#111111',
        },
        nav: {
          link: '#3F3F3F',
        },
        brand: {
          gigas: '#43329D',
          fringyFlower: '#AEE3C8',
          moodyBlue: '#8D82CE',
          coldPurple: '#A49BD4',
        },
      },
      fontFamily: {
        display: ['Poppins', 'Nunito Sans', 'Avenir Next', 'sans-serif'],
        body: ['Poppins', 'Nunito Sans', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        pill: '999px',
        card: '24px',
        blob: '40% 60% 55% 45% / 42% 38% 62% 58%',
      },
      boxShadow: {
        hard: '4px 4px 0 #111111',
        'hard-accent': '4px 4px 0 #43329D',
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '24px',
        6: '32px',
        7: '40px',
        8: '48px',
        9: '64px',
        10: '80px',
      },
      maxWidth: {
        container: '1320px',
      },
    },
  },
  plugins: [],
}

export default config
