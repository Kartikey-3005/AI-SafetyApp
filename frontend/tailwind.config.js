/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Violet Dusk Palette
        dusk: {
          darkest: '#1A0E23', // Deepest background tint
          dark: '#2A1638',    // Deep violet surface
          surface: '#381E48', // Card background / dark base
          base: '#502D55',    // Primary Deep Violet Dusk
          plum: '#723B69',    // Mid plum
          rose: '#935073',    // Velvet Rose / Muted Berry
          peach: '#F6DBC0',   // Warm Peach Cream Accent
          cream: '#F8F4E9',   // Warm Linen / Lightest Cream
        },
        abyss: {
          DEFAULT: '#1D1126', // Violet Dusk Deep Background
          deep: '#150B1C',
          light: '#2C1B38',
        },
        carbon: {
          DEFAULT: '#2A1738', // Violet Card Surface
          card: '#2A1738',
          hover: '#361E48',
          border: '#4A2A5E',  // Violet Border
          muted: '#5C3872',
        },
        azure: {
          DEFAULT: '#935073', // Primary Rose Accent
          electric: '#F6DBC0', // Peach highlight
          glow: '#935073',
          dark: '#502D55',
          deep: '#381E48',
          light: '#F8F4E9',
        },
        crisp: '#F8F4E9',  // Violet Dusk Warm White
        steel: '#C4B0C7',  // Soft Muted Lilac/Steel
      },
      textColor: {
        primary: '#F8F4E9',
        secondary: '#C4B0C7',
      },
      boxShadow: {
        'dusk-sm': '0 0 10px rgba(147, 80, 115, 0.3)',
        'dusk': '0 0 20px rgba(147, 80, 115, 0.4)',
        'dusk-lg': '0 0 35px rgba(246, 219, 192, 0.35)',
        'peach-glow': '0 0 15px rgba(246, 219, 192, 0.4)',
        'violet-glow': '0 0 25px rgba(80, 45, 85, 0.8), 0 0 10px rgba(147, 80, 115, 0.5)',
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
