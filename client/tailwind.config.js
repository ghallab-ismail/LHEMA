/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'lhema-cream': '#F9F8F4', // Alabaster/Warm Cream - Old Money Heritage
        'lhema-black': '#1A1A1A', // Soft Black - Less harsh
        'lhema-gold': '#C2B280',  // Muted Gold - For thin borders
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Montserrat"', 'sans-serif'],
      },
      letterSpacing: {
        'widest': '0.15em', // 2px-ish tracking for body
        'tight': '-0.02em', // For headlines
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      animation: {
        'fade-in': 'fadeIn 3s ease-in-out forwards',
        'reveal': 'reveal 1.5s cubic-bezier(0.77, 0, 0.175, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        reveal: {
          '0%': { clipPath: 'inset(0 100% 0 0)' },
          '100%': { clipPath: 'inset(0 0 0 0)' },
        }
      },
    },
  },
  plugins: [],
}
