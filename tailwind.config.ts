import { error } from 'console';
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/containers/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/*.{js,ts,jsx,tsx,mdx}',
    './public/assets/svg/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      mobile: { min: '320px', max: '639px' },
      sm: { min: '640px' },
      md: { min: '768px' },
      lg: { min: '1024px' },
      '2lg': { min: '1024px', max: '1231px' },
      xl: { min: '1280px' },
      '2xl': { min: '1536px' },
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      scale: {
        '102': '1.02',
      },
      colors: {
        // brand color
        'brand-color': 'var(--brand-color)', // blue
        'brand-color-hover': '#1FD18E1A', // blue
        'brand-color-hover-dark': '#2b213c', // blue

        'gradient-color-from': 'rgba(199, 168, 255, 0.2)',
        'gradient-color-to': 'rgba(109, 62, 193, 0.2)',

        // error
        error: '#ff0000', //red
        'error-dark': '#D20000', //red
        //menu hover
        'menu-hover': '#b6adb1',

        //sell button on home screen
        'sell-btn': '#ff2636',
        'sell-btn-hover': '#016f5e',

        // text color
        'text-primary-light': '#202020', //in use
        'text-secondary-light': '#FFFFFF', //in use
        'text-tertiary-light': '#57585A',
        'text-quaternary-light': '#666666',
        'text-quinary-light': '#808080',
        'text-senary-light': '#087cbd',
        'text-septenary-light': '#929293',
        'text-octonary-light': '#414244',
        'text-nonary-light': '#2C2C2D',
        'text-denary-light': '#C5C5C6',
        'text-undenary-light': '#1a1a1a',
        // ------------------------------------
        'text-primary-dark': '#FFFFFF',
        'text-secondary-dark': '#202020',
        'text-tertiary-dark': '#929293',
        'text-quaternary-dark': '#57585A',
        'text-quinary-dark': '#F1F1F1',
        'text-senary-dark': '#929293',

        // background color
        'bg-primary-light': '#000000',
        'bg-secondary-light': '#FFFFFF',
        'bg-tertiary-light': '#F0F1F1',
        'bg-quaternary-light': '#C5C5C6',
        'bg-quinary-light': '#087cbd',
        'bg-senary-light': '#f5f5f5',
        'bg-septenary-light': '#F3F3F3',
        'bg-octonary-light': '#F4F4F4',
        'bg-nonary-light': '#FF5151',
        'bg-denary-light': '#2C2C2D',
        'bg-undenary-light': '#2C2C2D',
        'bg-duodenary-light': '#fff0d0',
        'bg-terdenary-light': '#EAEAEA',
        'bg-quattuordenary-light': '#E9FBF4',
        'bg-quinquedenary-light': '#F6F6F6',
        'bg-sexdenary-light': '#374151',
        //-------------------------------------
        'bg-primary-dark': '#1A1A1A',
        'bg-secondary-dark': '#242424',
        'bg-tertiary-dark': '#363636',
        'bg-quaternary-dark': '#FFFFFF',
        'bg-quinary-dark': '#323232',
        'bg-senary-dark': '#434343',
        'bg-septenary-dark': '#969696',
        'bg-octonary-dark': '#E7E7E7',
        'bg-nonary-dark': '#2F2F2F',
        'bg-denary-dark': '#3C3C3C',
        'bg-undenary-dark': '#202020',
        'bg-duodenary-dark': '#414141',
        'bg-quattuordenary-dark': '#15392B',
        'bg-quinquedenary-dark': '#242424',
        'bg-sexdenary-dark': '#343434',

        // border color
        'border-primary-light': '#000000',
        'border-secondary-light': '#FFFFFF',
        'border-tertiary-light': '#DBDBDB',
        'border-quaternary-light': '#C5C5C6',
        'border-quinary-light': '#087cbd',
        'border-senary-light': '#57585A',
        'border-septenary-light': '#DDDDDD',
        'border-octonary-light': '#363636',
        'border-nonary-light': '#E5E5E5',
        'border-denary-light': '#e7e7e7',
        'border-undenary-light': '##DEE2E6',
        //-------------------------------------
        'border-primary-dark': '#929293',
        'border-secondary-dark': '#242424',
        'border-tertiary-dark': '#3D3B45',

        //button
        'btn-primary-light': 'var(--brand-color)',
        'btn-secondary-light': '#000000',
        'btn-tertiary-light': '#FFFFFF',
        'btn-quaternary-light': '#008F79',
        'btn-quinary-light': '#016F5E',
        'btn-bg-primary-light': '#1FD18E',
        //-------------------------------------
        'btn-primary-dark': '',
        'btn-secondary-dark': '',

        // ratting color
        'rating-primary-primary-dark': '#FDB514',
        //  link color
        'link-primary': '#377DFF',
      },
    },
    fontFamily: {
      primary: ['Poppins', 'sans-serif'],
    },

    // "primary-black": "#000000",//
    // "secondary":"#FFFFFF",//white

    // "bg-primary": "#FFFFFF", // white
    // "bg-secondary": "#F0F1F1", //texture

    // dark mode
    // "dark-bg-primary":"#242424",
    // "dark-text-primary":"",
    // "dark-text-secondary":"#6F7173",

    // --primary-color: #007bff; /* Primary color */
    // --secondary-color: #6c757d; /* Secondary color */
    // --tertiary-color: #28a745; /* Tertiary color */
    // --quaternary-color: #ffc107; /* Quaternary color */
    // --quinary-color: #17a2b8; /* Quinary color */
    // --senary-color: #fd7e14; /* Senary color */
    // --septenary-color: #6610f2; /* Septenary color */
    // --octonary-color: #e83e8c; /* Octonary color */
    // --nonary-color: #20c997; /* Nonary color */
    // --denary-color: #6f42c1; /* Denary color */
    // --undenary-color: #d9534f; /* Undenary color */
    // --duodenary-color: #292b2c; /* Duodenary color */
    // --terdenary-color: #5bc0de; /* Terdenary color */
    // --quattuordenary-color: #f7e1a0; /* Quattuordenary color */
    // --quinquedenary-color: #5cb85c; /* Quinquedenary color */
    // --sexdenary-color: #f0ad4e; /* Sexdenary color */
    // --septendenary-color: #337ab7; /* Septendenary color */
    // --octodenary-color: #a94442; /* Octodenary color */
    // --novemdenary-color: #8a6d3b; /* Novemdenary color */
    // --vigintenary-color: #5e5e5e; /* Vigintenary color */
  },
  plugins: [require('@tailwindcss/aspect-ratio')],
};
export default config;
