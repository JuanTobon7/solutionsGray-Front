/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true
    },
    extend: {
      screens: {
        xs: '310px', // Agregado un tamaño extra para dispositivos muy pequeños
        sm: '640px', // Modificado para dispositivos pequeños (teléfonos)
        md: '750px', // Modificado para dispositivos medianos (tabletas)
        lg: '1010px', // Modificado para dispositivos grandes (laptops)
        xl: '1280px', // Mantenido para dispositivos extra grandes (laptops grandes, monitores)
        '2xl': '1536px' // Mantenido para dispositivos extra extra grandes (monitores grandes)
      },
      colors: {
        primary: {
          50: '#f5f3f1',
          100: '#e5e2dc',
          200: '#ccc7bc',
          300: '#afa695',
          400: '#978b78',
          500: '#8b7d6b',
          600: '#756759',
          700: '#5f5249',
          800: '#524741',
          900: '#483e3b',
          950: '#282120'
        },
        second: {
          50: '#f2f7f3',
          100: '#dfece1',
          200: '#c1d9c6',
          300: '#a3c4ac',
          400: '#6b9c7a',
          500: '#4b7e5c',
          600: '#376447',
          700: '#2c503a',
          800: '#25402f',
          900: '#1f3528',
          950: '#111d16'
        }        
      }
    }
  },
  plugins: []
}