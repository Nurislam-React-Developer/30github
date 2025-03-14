'use client';

import Link from 'next/link';
import { useTheme } from './theme/ThemeContext';

export default function NotFound() {
	const { darkMode } = useTheme();

	return (
		<div
			className={`min-h-screen flex flex-col items-center justify-center p-4 ${
				darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
			}`}
		>
			<div className='text-center'>
				<h1 className='text-9xl font-bold text-blue-600 dark:text-blue-400'>
					404
				</h1>
				<h2 className='text-4xl font-semibold mt-4 mb-6'>
					Страница не найдена
				</h2>
				<p className='text-lg mb-8 text-gray-600 dark:text-gray-300'>
					Извините, страница, которую вы ищете, не существует или была
					перемещена.
				</p>
				<Link
					href='/'
					className='px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 inline-flex items-center'
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-5 w-5 mr-2'
						viewBox='0 0 20 20'
						fill='currentColor'
					>
						<path
							fillRule='evenodd'
							d='M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z'
							clipRule='evenodd'
						/>
					</svg>
					Вернуться на главную
				</Link>
			</div>
		</div>
	);
}
