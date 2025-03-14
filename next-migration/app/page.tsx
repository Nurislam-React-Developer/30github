'use client';

import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { selectCurrentUser } from './store/userSlice';
import { useTheme } from './theme/ThemeContext';

export default function Home() {
	const { darkMode } = useTheme();
	const currentUser = useSelector(selectCurrentUser);
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedPost, setSelectedPost] = useState(null);
	const [commentText, setCommentText] = useState('');

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				setLoading(true);
				setError(null);
				// Load posts from localStorage
				const localPosts = JSON.parse(localStorage.getItem('posts') || '[]');
				setPosts(localPosts);
			} catch (err) {
				setPosts([]);
				setError('Failed to load posts. Please try again.');
				console.error('Error loading posts:', err);
			} finally {
				setLoading(false);
			}
		};
		fetchPosts();
	}, []);

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

			// Update UI immediately
			setPosts(updatedPosts);
			try {
				localStorage.setItem('posts', JSON.stringify(updatedPosts));
			} catch (storageError) {
				// If storage is full, remove older posts
				const postsToKeep = updatedPosts.slice(
					0,
					Math.max(1, Math.floor(updatedPosts.length / 2))
				);
				localStorage.setItem('posts', JSON.stringify(postsToKeep));
				setPosts(postsToKeep);
				toast.warning(
					'Старые посты были автоматически удалены для освобождения места',
					{
						position: 'top-right',
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						theme: darkMode ? 'dark' : 'light',
					}
				);
			}
		} catch (error) {
			console.error('Error liking post:', error);
			toast.error('Не удалось обновить лайк. Пожалуйста, попробуйте еще раз.');
		}
	};

	const formatTimestamp = (timestamp) => {
		try {
			const date = new Date(timestamp);
			return format(date, 'PPp', { locale: ru });
		} catch (error) {
			console.error('Error formatting date:', error);
			return 'Invalid date';
		}
	};

	return (
		<main className='container-custom py-6 animate-fade-in'>
			{loading ? (
				<div className='flex justify-center items-center h-64'>
					<div className='text-primary-light dark:text-primary-dark text-xl'>
						Загрузка постов...
					</div>
				</div>
			) : error ? (
				<div className='bg-red-100 dark:bg-red-900 p-4 rounded-lg text-center'>
					<p className='text-red-700 dark:text-red-300'>{error}</p>
					<button
						className='mt-2 bg-primary-light dark:bg-primary-dark text-white px-4 py-2 rounded-lg'
						onClick={() => window.location.reload()}
					>
						Попробовать снова
					</button>
				</div>
			) : posts.length === 0 ? (
				<div className='text-center p-8 bg-card-light dark:bg-card-dark rounded-lg shadow'>
					<h2 className='text-xl font-semibold text-text-light dark:text-text-dark mb-4'>
						Нет доступных постов
					</h2>
					<p className='text-gray-600 dark:text-gray-400 mb-6'>
						Создайте свой первый пост или подождите, пока другие пользователи
						поделятся контентом.
					</p>
					<button
						className='bg-primary-light dark:bg-primary-dark text-white px-6 py-2 rounded-full hover:opacity-90 transition-opacity'
						onClick={() => (window.location.href = '/create-post')}
					>
						Создать пост
					</button>
				</div>
			) : (
				<div className='grid grid-cols-1 gap-6'>
					{/* Posts will be rendered here */}
					<p className='text-center text-gray-600 dark:text-gray-400'>
						Компоненты постов будут добавлены в следующих шагах миграции
					</p>
				</div>
			)}
		</main>
	);
}
