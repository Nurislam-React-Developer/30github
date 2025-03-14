'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTheme } from '../theme/ThemeContext';

export default function NotFound() {
	const router = useRouter();
	const { darkMode } = useTheme();
	const [countdown, setCountdown] = useState(5);

	useEffect(() => {
		const timer = setInterval(() => {
			setCountdown((prev) => prev - 1);
		}, 1000);

		const redirectTimer = setTimeout(() => {
			router.push('/');
		}, 5000);

		return () => {
			clearInterval(timer);
			clearTimeout(redirectTimer);
		};
	}, [router]);

	return (
		<div
			className={`min-h-screen flex justify-center items-center p-5 ${
				darkMode ? 'bg-background-dark' : 'bg-background-light'
			}`}
		>
			<div className='text-center max-w-lg p-10 rounded-2xl shadow-lg'>
				<motion.h1
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{
						type: 'spring',
						stiffness: 260,
						damping: 20,
						delay: 0.2,
					}}
					className={`text-8xl font-bold mb-5 ${
						darkMode
							? 'bg-gradient-to-r from-primary-dark to-purple-600 text-transparent bg-clip-text'
							: 'bg-gradient-to-r from-primary-light to-blue-500 text-transparent bg-clip-text'
					}`}
				>
					404
				</motion.h1>

				<motion.h2
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5 }}
					className={`text-xl font-medium mb-4 ${
						darkMode ? 'text-primary-dark' : 'text-primary-light'
					}`}
				>
					Упс! Страница не найдена
				</motion.h2>

				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.7 }}
					className={`mb-8 ${darkMode ? 'text-white/50' : 'text-black/50'}`}
				>
					Похоже, страница, которую вы ищете, не существует или была перемещена.
					<br />
					Перенаправление на главную через {countdown} секунд...
				</motion.p>

				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.9 }}
					onClick={() => router.push('/')}
					className={`px-8 py-3 rounded-full text-white ${
						darkMode
							? 'bg-gradient-to-r from-primary-dark to-purple-600'
							: 'bg-gradient-to-r from-primary-light to-blue-500'
					}`}
				>
					Вернуться на главную
				</motion.button>

				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{
						type: 'spring',
						stiffness: 100,
						damping: 10,
						delay: 0.3,
					}}
					className='mt-8 flex justify-center'
				>
					<svg
						width='200'
						height='200'
						viewBox='0 0 200 200'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<motion.circle
							cx='100'
							cy='100'
							r='80'
							stroke={darkMode ? '#bb86fc' : '#3f51b5'}
							strokeWidth='4'
							initial={{ pathLength: 0 }}
							animate={{ pathLength: 1 }}
							transition={{ duration: 2, ease: 'easeInOut' }}
						/>
						<motion.path
							d='M65 80C65 80 85 100 100 100C115 100 135 80 135 80'
							stroke={darkMode ? '#bb86fc' : '#3f51b5'}
							strokeWidth='4'
							strokeLinecap='round'
							initial={{ pathLength: 0 }}
							animate={{ pathLength: 1 }}
							transition={{ duration: 1, delay: 1 }}
						/>
						<motion.circle
							cx='75'
							cy='60'
							r='5'
							fill={darkMode ? '#bb86fc' : '#3f51b5'}
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ duration: 0.5, delay: 2 }}
						/>
						<motion.circle
							cx='125'
							cy='60'
							r='5'
							fill={darkMode ? '#bb86fc' : '#3f51b5'}
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ duration: 0.5, delay: 2 }}
						/>
					</svg>
				</motion.div>
			</div>
		</div>
	);
}
