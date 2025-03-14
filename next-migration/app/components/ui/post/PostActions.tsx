'use client';

import { useTheme } from '@/app/theme/ThemeContext';

interface PostActionsProps {
	post: {
		id: number;
		likes: number;
		liked?: boolean;
		comments: any[];
	};
	onLike: (postId: number) => void;
	onOpenComments: (post: any) => void;
}

const PostActions = ({ post, onLike, onOpenComments }: PostActionsProps) => {
	const { darkMode } = useTheme();

	return (
		<div className='flex justify-between items-center pt-2'>
			<button
				className={`flex items-center space-x-1 ${
					post?.liked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
				}`}
				onClick={() => onLike(post?.id)}
			>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='h-5 w-5'
					viewBox='0 0 20 20'
					fill={post?.liked ? 'currentColor' : 'none'}
					stroke='currentColor'
					strokeWidth={post?.liked ? '0' : '1.5'}
				>
					<path
						fillRule='evenodd'
						d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z'
						clipRule='evenodd'
					/>
				</svg>
				<span>{post?.likes || 0}</span>
			</button>

			<button
				className='flex items-center space-x-1 text-gray-500 dark:text-gray-400'
				onClick={() => onOpenComments(post)}
			>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='h-5 w-5'
					viewBox='0 0 20 20'
					fill='currentColor'
				>
					<path
						fillRule='evenodd'
						d='M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z'
						clipRule='evenodd'
					/>
				</svg>
				<span>{post?.comments?.length || 0}</span>
			</button>

			<button className='flex items-center space-x-1 text-gray-500 dark:text-gray-400'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='h-5 w-5'
					viewBox='0 0 20 20'
					fill='none'
					stroke='currentColor'
					strokeWidth='1.5'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						d='M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z'
					/>
				</svg>
			</button>
		</div>
	);
};

export default PostActions;
