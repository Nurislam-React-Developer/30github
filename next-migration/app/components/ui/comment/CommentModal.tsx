'use client';

import { useTheme } from '@/app/theme/ThemeContext';
import { useEffect, useRef } from 'react';
import CommentInput from './CommentInput';
import CommentList from './CommentList';

interface Comment {
	id: number;
	userId: number;
	userName: string;
	userAvatar: string;
	text: string;
	timestamp: string;
}

interface Post {
	id: number;
	userId: number;
	userName: string;
	comments: Comment[];
}

interface CommentModalProps {
	post: Post | null;
	currentUserId?: number;
	onClose: () => void;
	onAddComment: (postId: number, commentText: string) => void;
}

const CommentModal = ({
	post,
	currentUserId,
	onClose,
	onAddComment,
}: CommentModalProps) => {
	const { darkMode } = useTheme();
	const modalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				modalRef.current &&
				!modalRef.current.contains(event.target as Node)
			) {
				onClose();
			}
		};

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		document.addEventListener('keydown', handleEscape);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			document.removeEventListener('keydown', handleEscape);
		};
	}, [onClose]);

	if (!post) return null;

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4'>
			<div
				ref={modalRef}
				className={`w-full max-w-lg rounded-lg shadow-xl ${
					darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
				} max-h-[90vh] overflow-hidden flex flex-col`}
			>
				<div className='flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700'>
					<h3 className='text-lg font-medium'>Комментарии</h3>
					<button
						onClick={onClose}
						className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='h-6 w-6'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M6 18L18 6M6 6l12 12'
							/>
						</svg>
					</button>
				</div>

				<div className='flex-1 overflow-y-auto p-4'>
					<CommentList comments={post.comments} currentUserId={currentUserId} />
				</div>

				<div className='p-4 border-t border-gray-200 dark:border-gray-700'>
					<CommentInput postId={post.id} onAddComment={onAddComment} />
				</div>
			</div>
		</div>
	);
};

export default CommentModal;
