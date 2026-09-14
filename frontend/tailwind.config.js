/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // New Palette from Image
        palette: {
          midnight: '#161E2F',  // Deepest dark blue/slate base
          navy: '#242F49',      // Dark slate navy card surface
          slate: '#384358',     // Muted steel slate border & hover
          peach: '#FFA586',     // Warm glowing peach accent
          crimson: '#B51A2B',   // Bold vibrant crimson / alert
          maroon: '#541A2E',    // Deep berry wine / dark maroon
        },
        dusk: {
          darkest: '#161E2F',
          dark: '#242F49',
          surface: '#242F49',
          base: '#541A2E',
          plum: '#541A2E',
          rose: '#B51A2B',
          peach: '#FFA586',
          cream: '#FFF1EB',
        },
        abyss: {
          DEFAULT: '#161E2F',
          deep: '#101624',
          light: '#242F49',
        },
        carbon: {
          DEFAULT: '#242F49',
          card: '#242F49',
          hover: '#2E3B5B',
          border: '#384358',
          muted: '#5A6B8A',
        },
        azure: {
          DEFAULT: '#FFA586',
          electric: '#FFA586',
          glow: '#B51A2B',
          dark: '#541A2E',
          deep: '#242F49',
          light: '#FFF1EB',
        },
        crisp: '#FFF1EB',
        steel: '#A2B0C7',
      },
      textColor: {
        primary: '#FFF1EB',
        secondary: '#A2B0C7',
      },
      boxShadow: {
        'dusk-sm': '0 0 10px rgba(181, 26, 43, 0.3)',
        'dusk': '0 0 20px rgba(181, 26, 43, 0.4)',
        'dusk-lg': '0 0 35px rgba(255, 165, 134, 0.35)',
        'peach-glow': '0 0 15px rgba(255, 165, 134, 0.45)',
        'crimson-glow': '0 0 20px rgba(181, 26, 43, 0.6)',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.9', boxShadow: '0 0 15px rgba(147, 80, 115, 0.5)' },
          '50%': { opacity: '0.4', boxShadow: '0 0 5px rgba(80, 45, 85, 0.2)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
