import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useTheme } from '../../theme/ThemeContext';
import Footer from '../Footer';
import Header from '../Header';
import TetrisLoader from '../ui/TetrisLoader';

const Layout = () => {
	const { darkMode } = useTheme();
	const location = useLocation();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 1000);

		return () => clearTimeout(timer);
	}, [location.pathname]);

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
			{isLoading ? (
				<TetrisLoader />
			) : (
				<Outlet />
			)}
			<Footer />
		</motion.div>
	);
};

export default Layout;
