/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.tsx'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: 'Roboto, sans-serif'
      },
      colors: {
        bgPrimaryDark: '#121214',
        greenPrimary: '#129E57',
        yellowPrimary: '#F7DD43'
      },
      backgroundImage: {
        'bg-stripes': "url('/app-bg.png')"
      }
    },
    screens: {
      smallPhone: { max: '420px' },
      phone: { max: '540px' },
      tablet: { max: '950px' },
      desktopSmall: { max: '1140px' }
    }
  },
  plugins: []
}
