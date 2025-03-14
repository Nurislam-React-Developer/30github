'use client';

import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useLoading } from '../context/LoadingContext';
import { selectCurrentUser } from '../store/userSlice';
import { useTheme } from '../theme/ThemeContext';

export default function Home() {
	const { darkMode } = useTheme();
	const { showLoader, hideLoader } = useLoading();
	const currentUser = useSelector(selectCurrentUser);
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				showLoader();
				setError(null);
				// Load posts from localStorage
				const localPosts = JSON.parse(localStorage.getItem('posts') || '[]');
				setPosts(localPosts);
			} catch (err) {
				setPosts([]);
				setError('Failed to load posts. Please try again.');
				console.error('Error loading posts:', err);
			} finally {
				hideLoader();
				setLoading(false);
			}
		};
		fetchPosts();
	}, [showLoader, hideLoader]);

	const handleLike = async (postId) => {
		try {
			// Get current user info
			const userName =
				currentUser?.name || localStorage.getItem('profileName') || 'Anonymous';

			// Find the post being liked
			const targetPost = posts.find((post) => post.id === postId);
			const isLiking = !targetPost.liked;

			const updatedPosts = posts.map((post) => {
				if (post.id === postId) {
					return {
						...post,
						liked: !post.liked,
						likes: post.liked ? post.likes - 1 : post.likes + 1,
					};
				}
				return post;
			});

			setPosts(updatedPosts);
			localStorage.setItem('posts', JSON.stringify(updatedPosts));

			// Create notification for the post owner if this is a like (not an unlike)
			if (isLiking && targetPost.userId !== currentUser?.id) {
				const notifications = JSON.parse(
					localStorage.getItem('notifications') || '[]'
				);

				const newNotification = {
					id: Date.now(),
					type: 'like',
					postId: postId,
					userId: currentUser?.id || 1,
					userName: userName,
					userAvatar: currentUser?.avatar || 'https://i.pravatar.cc/150?img=3',
					timestamp: new Date().toISOString(),
					read: false,
				};

				localStorage.setItem(
					'notifications',
					JSON.stringify([newNotification, ...notifications])
				);

				// Dispatch custom event to update notification count
				window.dispatchEvent(new Event('notificationsUpdated'));
			}
		} catch (error) {
			console.error('Error liking post:', error);
			toast.error('Failed to like post. Please try again.');
		}
	};

	const handleComment = async (postId, commentText) => {
		try {
			// Get current user info
			const userName =
				currentUser?.name || localStorage.getItem('profileName') || 'Anonymous';
			const userAvatar =
				currentUser?.avatar ||
				localStorage.getItem('profileAvatar') ||
				'https://i.pravatar.cc/150?img=3';

			const newComment = {
				id: Date.now(),
				userId: currentUser?.id || 1,
				userName: userName,
				userAvatar: userAvatar,
				text: commentText,
				timestamp: new Date().toISOString(),
			};

			const updatedPosts = posts.map((post) => {
				if (post.id === postId) {
					return {
						...post,
						comments: [...post.comments, newComment],
					};
				}
				return post;
			});

			setPosts(updatedPosts);
			localStorage.setItem('posts', JSON.stringify(updatedPosts));

			// Find the post to create notification
			const targetPost = posts.find((post) => post.id === postId);

			// Create notification for the post owner if it's not the current user
			if (targetPost && targetPost.userId !== currentUser?.id) {
				const notifications = JSON.parse(
					localStorage.getItem('notifications') || '[]'
				);

				const newNotification = {
					id: Date.now(),
					type: 'comment',
					postId: postId,
					userId: currentUser?.id || 1,
					userName: userName,
					userAvatar: userAvatar,
					commentText:
						commentText.substring(0, 50) +
						(commentText.length > 50 ? '...' : ''),
					timestamp: new Date().toISOString(),
					read: false,
				};

				localStorage.setItem(
					'notifications',
					JSON.stringify([newNotification, ...notifications])
				);

				// Dispatch custom event to update notification count
				window.dispatchEvent(new Event('notificationsUpdated'));
			}

			toast.success('Комментарий добавлен!');
		} catch (error) {
			console.error('Error adding comment:', error);
			toast.error('Failed to add comment. Please try again.');
		}
	};

	if (error) {
		return (
			<div className='text-center py-10'>
				<p className='text-red-500 dark:text-red-400 mb-4'>{error}</p>
				<button
					onClick={() => window.location.reload()}
					className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
				>
					Попробовать снова
				</button>
			</div>
		);
	}

	return (
		<div
			className={`${
				darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
			} min-h-screen`}
		>
			<div className='container-custom py-4'>
				{posts.length > 0 ? (
					<div>
						{posts
							.sort(
								(a, b) =>
									new Date(b.timestamp).getTime() -
									new Date(a.timestamp).getTime()
							)
							.map((post) => (
								<div key={post.id} className='mb-6'>
									{/* We'll implement PostCard component later */}
									<div
										className={`rounded-lg shadow-md overflow-hidden ${
											darkMode ? 'bg-gray-800' : 'bg-white'
										}`}
									>
										<div className='p-4'>
											<div className='flex items-center mb-2'>
												<div className='w-10 h-10 rounded-full bg-gray-300 mr-3 overflow-hidden'>
													{post.userAvatar && (
														<img
															src={post.userAvatar}
															alt={post.userName}
															className='w-full h-full object-cover'
															onError={(e) => {
																const target = e.target as HTMLImageElement;
																target.src =
																	'https://via.placeholder.com/40?text=Error';
															}}
														/>
													)}
												</div>
												<div>
													<h3 className='font-medium'>{post.userName}</h3>
													<p className='text-xs text-gray-500 dark:text-gray-400'>
														{format(
															new Date(post.timestamp),
															'dd MMMM yyyy в HH:mm',
															{ locale: ru }
														)}
													</p>
												</div>
											</div>

											{post.description && (
												<p className='mb-3 whitespace-pre-line'>
													{post.description}
												</p>
											)}

											{post.image && (
												<div className='mb-3 rounded overflow-hidden'>
													<img
														src={post.image}
														alt='Post content'
														className='w-full max-h-96 object-cover'
														onError={(e) => {
															const target = e.target as HTMLImageElement;
															target.src =
																'https://via.placeholder.com/800x500?text=Error+Loading+Image';
														}}
													/>
												</div>
											)}

											<div className='flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700'>
												<button
													onClick={() => handleLike(post.id)}
													className={`flex items-center space-x-1 ${
														post.liked ? 'text-red-500' : ''
													}`}
												>
													<svg
														xmlns='http://www.w3.org/2000/svg'
														className='h-5 w-5'
														viewBox='0 0 20 20'
														fill={post.liked ? 'currentColor' : 'none'}
														stroke='currentColor'
														strokeWidth={post.liked ? '0' : '1.5'}
													>
														<path
															fillRule='evenodd'
															d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z'
															clipRule='evenodd'
														/>
													</svg>
													<span>{post.likes}</span>
												</button>

												<div className='flex items-center space-x-1'>
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
													<span>{post.comments.length}</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							))}
					</div>
				) : (
					<div className='text-center py-10'>
						<h2 className='text-2xl font-bold mb-4'>Нет постов</h2>
						<p className='mb-6'>
							Создайте свой первый пост или подождите, пока другие пользователи
							поделятся контентом.
						</p>
						<a
							href='/create-post'
							className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
						>
							Создать пост
						</a>
					</div>
				)}
			</div>
		</div>
	);
}
