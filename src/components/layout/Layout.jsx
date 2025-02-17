import { motion } from 'framer-motion';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../../theme/ThemeContext';
import Footer from '../Footer';
import Header from '../Header';

const Layout = () => {
	const { darkMode } = useTheme();

	return (
		<motion.div
			initial={{
				backgroundColor: darkMode ? '#000' : '#fff',
				color: darkMode ? '#fff' : '#000',
			}}
			animate={{
				backgroundColor: darkMode ? '#000' : '#fff',
				color: darkMode ? '#fff' : '#000',
			}}
			transition={{ duration: 0.5 }}
			style={{ minHeight: '100vh' }}
		>
			<Header />
			<Outlet />
			<Footer />
		</motion.div>
	);
};

export default Layout;
