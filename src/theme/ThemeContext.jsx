import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
	const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
		const savedTheme = localStorage.getItem('darkMode') === 'true';
		setDarkMode(savedTheme);
	}, []);

	const toggleTheme = () => {
		setDarkMode((prevMode) => !prevMode);
		localStorage.setItem('darkMode', !darkMode);
	};

	return (
		<ThemeContext.Provider value={{ darkMode, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => useContext(ThemeContext);
