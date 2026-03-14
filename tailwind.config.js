/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
      },
      colors: {
        cream: {
          DEFAULT: '#f5f0e8',
          dark: '#e8e0d4',
        },
        warm: {
          DEFAULT: '#8b6914',
          hover: '#6b5010',
        },
      },
      fontSize: {
        'body': ['1.25rem', { lineHeight: '1.5' }],
        'lead': ['1.125rem', { lineHeight: '1.5' }],
      },
      minHeight: {
        'touch': '48px',
      },
    },
  },
  plugins: [],
};
