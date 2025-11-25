import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'ubuntu': ['var(--font-ubuntu)', 'Ubuntu', 'sans-serif'],
        'sans': ['var(--font-ubuntu)', 'Ubuntu', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config