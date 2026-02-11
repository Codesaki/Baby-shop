import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                playfair: ['Playfair Display', 'serif'],
                architects: ['Architects Daughter', 'cursive'],
            },
            colors: {
                // Baby Shop Theme Colors
                primary: {
                    50: '#fdf8f6',
                    100: '#fceae3',
                    200: '#f8d4cc',
                    300: '#f4b8ae',
                    400: '#ed8b75',
                    500: '#e56744',
                    600: '#d94d3a',
                    700: '#b53d2e',
                    800: '#93332a',
                    900: '#782c27',
                },
                secondary: {
                    50: '#f5f9f8',
                    100: '#e0f0ed',
                    200: '#c2e0db',
                    300: '#a3d0c9',
                    400: '#6bb1b0',
                    500: '#4a9d9b',
                    600: '#338383',
                    700: '#2b6b6a',
                    800: '#235656',
                    900: '#1e4646',
                },
                accent: {
                    50: '#fffbf0',
                    100: '#fff5e0',
                    200: '#ffe9c1',
                    300: '#ffd99f',
                    400: '#ffb85a',
                    500: '#ff9c1a',
                    600: '#f08210',
                    700: '#c45a0f',
                    800: '#9b4710',
                    900: '#7d3a0f',
                },
                light: {
                    bg: '#faf8f6',
                    50: '#faf8f6',
                    100: '#f0ede8',
                    200: '#e6dfd6',
                    300: '#dcd3c5',
                    400: '#c8bfb2',
                    500: '#b5ab9f',
                    600: '#a39792',
                    700: '#827a70',
                    800: '#625b54',
                    900: '#4a4440',
                },
            },
            boxShadow: {
                'soft': '0 4px 6px rgba(0, 0, 0, 0.07)',
                'soft-lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
                'soft-xl': '0 20px 25px rgba(0, 0, 0, 0.1)',
            },
            backdropBlur: {
                'xs': '2px',
            },
        },
    },

    plugins: [forms],
};
