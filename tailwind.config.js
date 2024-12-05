/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/views/**/*.pug', './src/**/*.ts'],
  theme: {
    extend: {
      width: {
        '52rem': '52rem',
      },
      screens: {
        'max-1200': { max: '1200px' },
        'max-1000': { max: '1000px' },
        'max-900': { max: '900px' },
        'max-800': { max: '800px' },
        'max-700': { max: '700px' },
        'max-600': { max: '600px' },
        'max-550': { max: '550px' },
        'min-600': { min: '600px' },
        'min-800': { min: '801px' },
      },
    },
  },
  plugins: [],
};
