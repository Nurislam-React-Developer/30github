'use client';

import { useTheme } from '@/app/theme/ThemeContext';

interface PostHeaderProps {
	post: {
		id: number;
		userId: number;
		userName: string;
		userAvatar: string;
		timestamp: string;
		edited?: boolean;
	};
	currentUser: {
		id?: number;
		name?: string;
	};
	onMenuOpen: (event: React.MouseEvent<HTMLButtonElement>, post: any) => void;
	formatTimestamp: (timestamp: string) => string;
}

const PostHeader = ({
	post,
	currentUser,
	onMenuOpen,
	formatTimestamp,
}: PostHeaderProps) => {
	const { darkMode } = useTheme();

	return (
		<div className='p-4 flex items-center justify-between'>
			<div className='flex items-center'>
				<div className='w-10 h-10 rounded-full overflow-hidden bg-gray-300'>
					{post?.userAvatar && (
						<img
							src={post.userAvatar}
							alt={post.userName || 'User avatar'}
							className='w-full h-full object-cover'
							onError={(e) => {
								const target = e.target as HTMLImageElement;
								target.src = 'https://via.placeholder.com/40?text=User';
							}}
						/>
					)}
				</div>
				<div className='ml-3'>
					<h3
						className={`text-base font-medium ${
							darkMode ? 'text-white' : 'text-gray-900'
						}`}
					>
						{post?.userName || 'Anonymous'}
					</h3>
					<p
						className={`text-xs ${
							darkMode ? 'text-purple-300' : 'text-indigo-600'
						}`}
					>
						{formatTimestamp(post?.timestamp)}
						{post?.edited && ' (изменено)'}
					</p>
				</div>
			</div>
			{post?.userName === currentUser?.name && (
				<button
					className='p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'
					onClick={(e) => onMenuOpen(e, post)}
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className={`h-5 w-5 ${darkMode ? 'text-white' : 'text-gray-900'}`}
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z'
						/>
					</svg>
				</button>
			)}
		</div>
	);
};

export default PostHeader;
