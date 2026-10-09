/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        graphite: '#1C1C1E',
        accentBlue: '#007AFF',
        accentViolet: '#5E5CE6',
        successGreen: '#34C759',
        errorRed: '#FF3B30',
        warningAmber: '#FF9500'
      }
    },
  },
  plugins: [],
}
