'use client';

import { useTheme } from '@/app/theme/ThemeContext';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Comment {
	id: number;
	userId: number;
	userName: string;
	userAvatar: string;
	text: string;
	timestamp: string;
}

interface CommentListProps {
	comments: Comment[];
	currentUserId?: number;
}

const CommentList = ({ comments, currentUserId }: CommentListProps) => {
	const { darkMode } = useTheme();

	const formatCommentDate = (timestamp: string) => {
		try {
			return format(new Date(timestamp), 'dd MMM yyyy в HH:mm', { locale: ru });
		} catch (error) {
			console.error('Error formatting date:', error);
			return 'Invalid date';
		}
	};

	if (!comments || comments.length === 0) {
		return (
			<div
				className={`text-center py-4 ${
					darkMode ? 'text-gray-400' : 'text-gray-500'
				}`}
			>
				Нет комментариев. Будьте первым, кто оставит комментарий!
			</div>
		);
	}

	return (
		<div className='mt-4 space-y-4'>
			{comments.map((comment) => (
				<div
					key={comment.id}
					className={`p-3 rounded-lg ${
						darkMode ? 'bg-gray-700' : 'bg-gray-100'
					} ${
						comment.userId === currentUserId ? 'border-l-4 border-blue-500' : ''
					}`}
				>
					<div className='flex items-start'>
						<div className='flex-shrink-0 mr-3'>
							<div className='w-8 h-8 rounded-full overflow-hidden bg-gray-300'>
								{comment.userAvatar && (
									<img
										src={comment.userAvatar}
										alt={comment.userName}
										className='w-full h-full object-cover'
										onError={(e) => {
											const target = e.target as HTMLImageElement;
											target.src = 'https://via.placeholder.com/32?text=User';
										}}
									/>
								)}
							</div>
						</div>
						<div className='flex-1'>
							<div className='flex items-center justify-between mb-1'>
								<h4
									className={`text-sm font-medium ${
										darkMode ? 'text-white' : 'text-gray-900'
									}`}
								>
									{comment.userName}
								</h4>
								<span className='text-xs text-gray-500 dark:text-gray-400'>
									{formatCommentDate(comment.timestamp)}
								</span>
							</div>
							<p
								className={`text-sm ${
									darkMode ? 'text-gray-300' : 'text-gray-700'
								}`}
							>
								{comment.text}
							</p>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default CommentList;
