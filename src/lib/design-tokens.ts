export const designTokens = {
  colors: {
    background: { primary: '#F7F7F7', secondary: '#FFFFFF' },
    text: { primary: '#0B0B0B', secondary: '#43329D', muted: '#6F66A8' },
    accent: { primary: '#43329D', mint: '#AEE3C8', lavender: '#8D82CE', softPurple: '#A49BD4' },
    stroke: { primary: '#111111' },
    brand: { gigas: '#43329D', fringyFlower: '#AEE3C8', moodyBlue: '#8D82CE', coldPurple: '#A49BD4' },
  },
  typography: {
    display: "Poppins, Nunito Sans, Avenir Next, sans-serif",
    body: "Poppins, Nunito Sans, Inter, sans-serif",
  },
  radii: { pill: '999px', card: '24px', blob: '40% 60% 55% 45% / 42% 38% 62% 58%' },
  shadows: { hardOffset: '4px 4px 0 #43329D', button: '4px 4px 0 #111111' },
  spacing: [4, 8, 12, 16, 24, 32, 40, 48, 64, 80],
} as const

export type DesignTokens = typeof designTokens
