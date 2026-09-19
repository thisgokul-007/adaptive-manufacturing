/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgPrimary: '#0B0F14',
        bgSecondary: '#111820',
        cardBg: '#151D26',
        cardHover: '#1B2530',
        borderColor: '#273340',
        cyanAccent: '#00D4FF',
        purpleAccent: '#7C5CFF',
        statusGreen: '#22C55E',
        statusAmber: '#F59E0B',
        statusRed: '#EF4444',
        textPrimary: '#F8FAFC',
        textSecondary: '#94A3B8'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace']
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 212, 255, 0.25)',
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.25)',
        'glow-amber': '0 0 20px rgba(245, 158, 11, 0.25)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.25)',
        'glow-purple': '0 0 20px rgba(124, 92, 255, 0.25)',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
      }
    },
  },
  plugins: [],
}
