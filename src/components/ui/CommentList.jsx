import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import React from 'react';
import { toast } from 'react-toastify';
import { CommentItem } from './comment';

const CommentList = React.memo(
	({ comments, darkMode, onDeleteComment, postId }) => {
		// Use useMemo to avoid expensive operations on every render
		const userData = useMemo(() => {
			const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
			const userName = currentUser?.name || localStorage.getItem('profileName');
			const posts = JSON.parse(localStorage.getItem('posts') || '[]');
			const currentPost = posts.find((post) => post.id === postId);
			const isPostAuthor = currentPost?.author?.name === userName;
			return { currentUser, userName, posts, currentPost, isPostAuthor };
		}, [postId]); // Only recalculate when postId changes

		const { userName, isPostAuthor } = userData;
		// Memoize the formatTimestamp function to prevent unnecessary recalculations
		const formatTimestamp = useCallback((timestamp) => {
			try {
				if (!timestamp) return 'Invalid date';
				const date = new Date(timestamp);
				if (isNaN(date.getTime())) return 'Invalid date';
				return format(date, 'dd MMMM в HH:mm', { locale: ru });
			} catch (error) {
				console.error('Error formatting timestamp:', error);
				return 'Invalid date';
			}
		}, []);

		// Use useCallback to prevent unnecessary function recreations
		const handleLikeComment = useCallback(
			(commentId) => {
				try {
					// Get current user - reuse from memoized userData
					const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
					const localUserName =
						currentUser?.name || localStorage.getItem('profileName');

					// Get all posts
					const posts = JSON.parse(localStorage.getItem('posts') || '[]');
					const updatedPosts = posts.map((post) => {
						if (post.id === postId) {
							const updatedComments = post.comments.map((comment) => {
								if (comment.id === commentId) {
									const likes = comment.likes || [];
									const userLiked = likes.includes(localUserName);

									if (userLiked) {
										// Unlike
										return {
											...comment,
											likes: likes.filter((name) => name !== localUserName),
										};
									} else {
										// Only create notification if the post author likes the comment
										if (isPostAuthor) {
											const notifications = JSON.parse(
												localStorage.getItem('notifications') || '[]'
											);
											notifications.unshift({
												id: Date.now(),
												type: 'comment_like',
												user: localUserName,
												postId: postId,
												commentId: commentId,
												timestamp: new Date().toISOString(),
											});
											localStorage.setItem(
												'notifications',
												JSON.stringify(notifications)
											);

											// Show notification toast to comment owner
											if (comment.user.name !== localUserName) {
												toast.info(`${localUserName} лайкнул ваш комментарий`, {
													position: 'top-right',
													autoClose: 3000,
												});
											}
										}

										return {
											...comment,
											likes: [...likes, localUserName],
										};
									}
								}
								return comment;
							});
							return { ...post, comments: updatedComments };
						}
						return post;
					});

					localStorage.setItem('posts', JSON.stringify(updatedPosts));
					window.dispatchEvent(new Event('storage')); // Trigger update
				} catch (error) {
					console.error('Error handling comment like:', error);
					toast.error('Ошибка при обработке лайка');
				}
			},
			[postId, isPostAuthor]
		); // Add dependencies

		return (
			<>
				{comments.map((comment) => {
					const likes = comment.likes || [];

					return (
						<CommentItem
							key={comment.id}
							comment={comment}
							darkMode={darkMode}
							onDeleteComment={onDeleteComment}
							postId={postId}
							formatTimestamp={formatTimestamp}
							userName={userName}
							handleLikeComment={handleLikeComment}
							isPostAuthor={isPostAuthor}
							likes={likes}
						/>
					);
				})}
			</>
		);
	}
);

export default CommentList;
