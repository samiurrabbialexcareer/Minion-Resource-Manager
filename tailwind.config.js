/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'deep-violet': {
                    500: '#8B5CF6',
                    700: '#6D28D9',
                    900: '#4C1D95',
                    DEFAULT: '#4C1D95',
                },
                'electric-blue': {
                    400: '#60A5FA',
                    500: '#3B82F6',
                    DEFAULT: '#3B82F6',
                },
                background: '#0F172A', // dark slate
                surface: '#1E293B', // slightly lighter slate
                surface2: '#334155', // elevated
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
