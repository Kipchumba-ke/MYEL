/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: { fontFamily: { sans: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'] }, colors: { paper: '#f5f3ef', ink: '#171715', sand: '#d8c59a' } } },
  plugins: [],
}