'use client';

import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react';

type ThemeContextType = {
	darkMode: boolean;
	toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
	darkMode: false,
	toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
		// Load theme preference from localStorage
		const savedTheme = localStorage.getItem('darkMode') === 'true';
		setDarkMode(savedTheme);

		// Apply dark mode class to html element for Tailwind
		if (savedTheme) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}, []);

	const toggleTheme = () => {
		setDarkMode((prevMode) => {
			const newMode = !prevMode;
			localStorage.setItem('darkMode', String(newMode));

			// Toggle dark mode class for Tailwind
			if (newMode) {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}

			return newMode;
		});
	};

	return (
		<ThemeContext.Provider value={{ darkMode, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => useContext(ThemeContext);
