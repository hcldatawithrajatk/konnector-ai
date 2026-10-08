/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc7fb',
          400: '#38a8f7',
          500: '#0e8ce9',
          600: '#026fc7',
          700: '#0358a1',
          800: '#074b85',
          900: '#0b3f6f',
          950: '#082849',
        },
        whatsapp: {
          light: '#25D366',
          dark: '#128C7E',
          teal: '#075E54',
          chatbg: '#EFEAE2',
          bubbleOut: '#DCF8C6',
          bubbleIn: '#FFFFFF',
        },
      },
    },
  },
  plugins: [],
};
