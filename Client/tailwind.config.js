/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  important: '#root',
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        glow: '0 0 32px -4px rgba(99,102,241,0.45)',
        'glow-lg': '0 12px 48px -8px rgba(99,102,241,0.55)',
        soft: '0 8px 32px -8px rgba(15,23,42,0.25)',
      },
      backgroundImage: {
        'mesh-dark':
          'radial-gradient(at 20% 10%, rgba(59,130,246,0.18) 0px, transparent 55%), radial-gradient(at 85% 0%, rgba(139,92,246,0.18) 0px, transparent 55%), radial-gradient(at 50% 100%, rgba(236,72,153,0.12) 0px, transparent 55%)',
        'mesh-light':
          'radial-gradient(at 20% 10%, rgba(59,130,246,0.10) 0px, transparent 55%), radial-gradient(at 85% 0%, rgba(139,92,246,0.10) 0px, transparent 55%), radial-gradient(at 50% 100%, rgba(236,72,153,0.08) 0px, transparent 55%)',
      },
      animation: {
        'gradient-x': 'gradient-x 8s ease infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        shimmer: 'shimmer 2.4s linear infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        hotelDark: {
          primary: '#6366f1',
          secondary: '#8b5cf6',
          accent: '#22d3ee',
          neutral: '#0f172a',
          'base-100': '#0a0e1a',
          'base-200': '#0f172a',
          'base-300': '#1e293b',
          info: '#38bdf8',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
        },
      },
      {
        hotelLight: {
          primary: '#4f46e5',
          secondary: '#7c3aed',
          accent: '#0891b2',
          neutral: '#1e293b',
          'base-100': '#ffffff',
          'base-200': '#f8fafc',
          'base-300': '#e2e8f0',
          info: '#0284c7',
          success: '#059669',
          warning: '#d97706',
          error: '#dc2626',
        },
      },
    ],
    darkTheme: 'hotelDark',
    base: false,
    styled: true,
    utils: true,
    logs: false,
  },
};
