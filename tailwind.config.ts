import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0D0D0D',
        surface: '#161616',
        text: '#F0EDE6',
        accent: '#FF6B35',
        muted: '#888888',
        border: '#222222',
      },
      fontFamily: {
        head: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        mono: ['Courier New', 'Courier', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
