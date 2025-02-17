import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../../theme/ThemeContext';
import Footer from '../Footer';
import Header from '../Header';

const Layout = () => {
	const { darkMode } = useTheme();

	return (
		<div
			style={{
				backgroundColor: darkMode ? '#000' : '#fff',
				color: darkMode ? '#fff' : '#000',
				minHeight: '100vh',
			}}
		>
			<Header />
			<Outlet />
			<Footer />
		</div>
	);
};

export default Layout;
