/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',    // Inclui todos os arquivos JS/JSX/TS/TSX dentro de src
    './src/components/**/*.{js,jsx}', // Inclui todos os arquivos JS/JSX dentro de src/components
    './src/pages/**/*.{js,jsx}',      // Inclui todos os arquivos JS/JSX dentro de src/pages
    './src/styles/**/*.css',          // Inclui todos os arquivos CSS dentro de src/styles
    './src/data/**/*.{json,js}',      // Inclui todos os arquivos JSON e JS dentro de src/data
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
