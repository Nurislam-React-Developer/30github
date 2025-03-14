'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTheme } from '../theme/ThemeContext';

export default function Header() {
	const { darkMode, toggleTheme } = useTheme();
	const [notificationCount, setNotificationCount] = useState(0);

	useEffect(() => {
		const updateNotificationCount = () => {
			const updatedNotifications = JSON.parse(
				localStorage.getItem('notifications') || '[]'
			);
			setNotificationCount(updatedNotifications.length);
		};

		updateNotificationCount();

		window.addEventListener('storage', updateNotificationCount);

		const handleCustomEvent = () => {
			updateNotificationCount();
		};
		window.addEventListener('notificationsUpdated', handleCustomEvent);

		return () => {
			window.removeEventListener('storage', updateNotificationCount);
			window.removeEventListener('notificationsUpdated', handleCustomEvent);
		};
	}, []);

	return (
		<header
			className={`sticky top-0 z-50 ${
				darkMode ? 'bg-gray-900' : 'bg-blue-600'
			} text-white shadow-md`}
		>
			<div className='container-custom py-2'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center space-x-4'>
						<Link href='/' className='text-xl font-bold'>
							30 Day
						</Link>
						<nav className='hidden md:flex space-x-1'>
							<Link
								href='/'
								className='p-2 rounded-md hover:bg-opacity-20 hover:bg-white flex items-center'
							>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-5 w-5 mr-1'
									viewBox='0 0 20 20'
									fill='currentColor'
								>
									<path d='M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z' />
								</svg>
								<span>Главная</span>
							</Link>
							<Link
								href='/friends'
								className='p-2 rounded-md hover:bg-opacity-20 hover:bg-white flex items-center'
							>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-5 w-5 mr-1'
									viewBox='0 0 20 20'
									fill='currentColor'
								>
									<path d='M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z' />
								</svg>
								<span>Друзья</span>
							</Link>
							<Link
								href='/notifications'
								className='p-2 rounded-md hover:bg-opacity-20 hover:bg-white flex items-center'
							>
								<div className='relative'>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										className='h-5 w-5 mr-1'
										viewBox='0 0 20 20'
										fill='currentColor'
									>
										<path d='M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z' />
									</svg>
									{notificationCount > 0 && (
										<span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center'>
											{notificationCount}
										</span>
									)}
								</div>
								<span>Уведомления</span>
							</Link>
							<Link
								href='/create-post'
								className='p-2 rounded-md hover:bg-opacity-20 hover:bg-white flex items-center'
							>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-5 w-5 mr-1'
									viewBox='0 0 20 20'
									fill='currentColor'
								>
									<path
										fillRule='evenodd'
										d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
										clipRule='evenodd'
									/>
								</svg>
								<span>Создать пост</span>
							</Link>
						</nav>
					</div>

					<div className='flex items-center space-x-3'>
						<button
							onClick={toggleTheme}
							className='p-2 rounded-full hover:bg-opacity-20 hover:bg-white'
							aria-label='Toggle dark mode'
						>
							{darkMode ? (
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-5 w-5'
									viewBox='0 0 20 20'
									fill='currentColor'
								>
									<path
										fillRule='evenodd'
										d='M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z'
										clipRule='evenodd'
									/>
								</svg>
							) : (
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-5 w-5'
									viewBox='0 0 20 20'
									fill='currentColor'
								>
									<path d='M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z' />
								</svg>
							)}
						</button>

						<Link
							href='/profile'
							className='p-2 rounded-md hover:bg-opacity-20 hover:bg-white flex items-center'
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-5 w-5 mr-1'
								viewBox='0 0 20 20'
								fill='currentColor'
							>
								<path
									fillRule='evenodd'
									d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
									clipRule='evenodd'
								/>
							</svg>
							<span className='hidden md:inline'>Профиль</span>
						</Link>

						<Link
							href='/settings'
							className='p-2 rounded-md hover:bg-opacity-20 hover:bg-white flex items-center'
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-5 w-5 mr-1'
								viewBox='0 0 20 20'
								fill='currentColor'
							>
								<path
									fillRule='evenodd'
									d='M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z'
									clipRule='evenodd'
								/>
							</svg>
							<span className='hidden md:inline'>Настройки</span>
						</Link>
					</div>
				</div>

				{/* Mobile navigation */}
				<div className='md:hidden flex justify-around mt-2 pb-1'>
					<Link href='/' className='p-2 flex flex-col items-center text-xs'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='h-5 w-5'
							viewBox='0 0 20 20'
							fill='currentColor'
						>
							<path d='M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z' />
						</svg>
						<span>Главная</span>
					</Link>
					<Link
						href='/friends'
						className='p-2 flex flex-col items-center text-xs'
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='h-5 w-5'
							viewBox='0 0 20 20'
							fill='currentColor'
						>
							<path d='M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z' />
						</svg>
						<span>Друзья</span>
					</Link>
					<Link
						href='/create-post'
						className='p-2 flex flex-col items-center text-xs'
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='h-5 w-5'
							viewBox='0 0 20 20'
							fill='currentColor'
						>
							<path
								fillRule='evenodd'
								d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
								clipRule='evenodd'
							/>
						</svg>
						<span>Создать</span>
					</Link>
					<Link
						href='/notifications'
						className='p-2 flex flex-col items-center text-xs'
					>
						<div className='relative'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-5 w-5'
								viewBox='0 0 20 20'
								fill='currentColor'
							>
								<path d='M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z' />
							</svg>
							{notificationCount > 0 && (
								<span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center'>
									{notificationCount}
								</span>
							)}
						</div>
						<span>Уведомления</span>
					</Link>
				</div>
			</div>
		</header>
	);
}
