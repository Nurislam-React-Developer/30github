'use client';

import { useTheme } from '@/app/theme/ThemeContext';
import { useState } from 'react';

interface CommentInputProps {
	postId: number;
	onAddComment: (postId: number, commentText: string) => void;
	placeholder?: string;
}

const CommentInput = ({
	postId,
	onAddComment,
	placeholder = 'Добавить комментарий...',
}: CommentInputProps) => {
	const [commentText, setCommentText] = useState('');
	const { darkMode } = useTheme();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (commentText.trim()) {
			onAddComment(postId, commentText.trim());
			setCommentText('');
		}
	};

	return (
		<form onSubmit={handleSubmit} className='mt-2'>
			<div className='flex items-center'>
				<input
					type='text'
					value={commentText}
					onChange={(e) => setCommentText(e.target.value)}
					placeholder={placeholder}
					className={`flex-grow p-2 rounded-l-lg border ${
						darkMode
							? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
							: 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
					} focus:outline-none focus:ring-2 focus:ring-blue-500`}
				/>
				<button
					type='submit'
					disabled={!commentText.trim()}
					className={`px-4 py-2 rounded-r-lg ${
						darkMode
							? 'bg-blue-600 hover:bg-blue-700'
							: 'bg-blue-500 hover:bg-blue-600'
					} text-white font-medium ${
						!commentText.trim() ? 'opacity-50 cursor-not-allowed' : ''
					}`}
				>
					Отправить
				</button>
			</div>
		</form>
	);
};

export default CommentInput;
