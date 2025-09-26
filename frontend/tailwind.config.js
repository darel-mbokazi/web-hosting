/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', 
  ],
  theme: {
    extend: {
      colors: {
        primary: '#51C7F4',
        background: 'rgba(255, 255, 255, 0.856)',
        light_gray: '#ccc',
        vivid_blue: '#004AAD',
        text: '#6b7280',
      },
    },
  },
  plugins: [],
}
