/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        BaseColor: '#1D1DD7FF',
        GreenColor: '#388E3C',
        GrayColor: '#455A64',
        PurpleColor: '#1DA6CBFF',
        BHoverColor: '#4A8EE7FF',
      },
      fontFamily: {
        cursiveFont: ['Island Moments', 'cursive'],
        paraFont: ['Kalam', 'cursive'],
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};
