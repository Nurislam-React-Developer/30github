/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
	],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				primary: {
					light: '#3f51b5',
					DEFAULT: '#3f51b5',
					dark: '#bb86fc',
				},
				background: {
					light: '#ffffff',
					dark: '#121212',
				},
				card: {
					light: '#ffffff',
					dark: '#1e1e1e',
				},
				text: {
					light: '#000000',
					dark: '#ffffff',
				},
				secondary: {
					light: '#f5f5f5',
					dark: '#333333',
				},
			},
			animation: {
				'fade-in': 'fadeIn 0.5s ease-in-out',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
			},
		},
	},
	plugins: [],
};
