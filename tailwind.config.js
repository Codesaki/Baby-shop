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
                // Baby Shop Theme Colors - Blue based, warm neutrals
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                },
                secondary: {
                    50: '#ecfeff',
                    100: '#cffafe',
                    200: '#a5f3fc',
                    300: '#67e8f9',
                    400: '#22d3ee',
                    500: '#06b6d4',
                    600: '#0891b2',
                    700: '#0e7490',
                    800: '#155e75',
                    900: '#164e63',
                },
                accent: {
                    50: '#fdf2ff',
                    100: '#f8e4ff',
                    200: '#f0cfff',
                    300: '#e2b4ff',
                    400: '#cf90ff',
                    500: '#b667ff',
                    600: '#9845e6',
                    700: '#7c36b8',
                    800: '#632d91',
                    900: '#522777',
                },
                light: {
                    bg: '#f8fafc',
                    50: '#f8fafc',
                    100: '#e2e8f0',
                    200: '#cbd5f5',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                },
            },
            boxShadow: {
                'soft': '0 4px 6px rgba(15, 23, 42, 0.07)',
                'soft-lg': '0 10px 15px rgba(15, 23, 42, 0.12)',
                'soft-xl': '0 20px 25px rgba(15, 23, 42, 0.15)',
            },
            backdropBlur: {
                'xs': '2px',
            },
        },
    },

    plugins: [forms],
};
