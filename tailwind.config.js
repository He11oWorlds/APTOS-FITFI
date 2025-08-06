// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        techno: ['"Orbitron"', 'sans-serif'], // Or any techno font you choose
      },
      colors: {
        'quest-dark': '#1A1C24',
        'quest-bg': '#101217',
        'quest-green': '#00FF99', // You can adjust to match screenshot glow
      },
    },
  },
  plugins: [],
};
