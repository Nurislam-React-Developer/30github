import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Menu, MenuItem, Typography } from '@mui/material';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CommentModal from '../components/ui/CommentModal';
import PostCard from '../components/ui/PostCard';
import StoriesBar from '../components/ui/StoriesBar';
import TetrisLoader from '../components/ui/TetrisLoader';
import { selectCurrentUser } from '../store/userSlice';
import { useTheme } from '../theme/ThemeContext';

const Home = () => {
	const { darkMode } = useTheme();
	const currentUser = useSelector(selectCurrentUser);
	const navigate = useNavigate();
	const [selectedPost, setSelectedPost] = useState(null);
	const [commentText, setCommentText] = useState('');
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [editingPost, setEditingPost] = useState(null);
	const [editText, setEditText] = useState('');
	const [anchorEl, setAnchorEl] = useState(null);
	const [selectedPostForMenu, setSelectedPostForMenu] = useState(null);

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

			// Create notification if the user is liking (not unliking) and it's not their own post
			if (isLiking && targetPost.user.name !== userName) {
				// Get existing notifications or create empty array
				const notifications = JSON.parse(
					localStorage.getItem('notifications') || '[]'
				);

				// Add new notification at the beginning of the array
				notifications.unshift({
					id: Date.now(),
					type: 'post_like',
					user: userName,
					postId: postId,
					timestamp: new Date().toISOString(),
					read: false,
				});

				// Save updated notifications
				localStorage.setItem('notifications', JSON.stringify(notifications));

				// Dispatch custom event to update notification count
				window.dispatchEvent(new Event('notificationsUpdated'));

				// Show notification to post owner
				toast.info(`${userName} лайкнул ваш пост`, {
					position: 'top-right',
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					theme: darkMode ? 'dark' : 'light',
				});
			}
		} catch (error) {
			console.error('Error liking post:', error);
		}
	};

	const handleOpenComments = (post) => {
		setSelectedPost(post);
	};

	const handleCloseComments = () => {
		setSelectedPost(null);
		setCommentText('');
	};

	const handleAddComment = async () => {
		if (!commentText.trim()) return;

		try {
			// Get current user data from Redux store or localStorage
			const userData = JSON.parse(localStorage.getItem('user')) || {};
			const userName =
				currentUser?.name ||
				userData.name ||
				localStorage.getItem('profileName') ||
				'Anonymous';
			const userAvatar =
				currentUser?.avatar ||
				userData.avatar ||
				localStorage.getItem('profileAvatar') ||
				'/logo.png';

			const newComment = {
				id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
				user: {
					name: userName,
					avatar: userAvatar,
				},
				text: commentText,
				timestamp: new Date().toISOString(),
				likes: [],
			};

			// Update selected post with new comment
			setSelectedPost((prev) => ({
				...prev,
				comments: [...(prev.comments || []), newComment],
			}));

			// Update posts state
			const updatedPosts = posts.map((post) => {
				if (post.id === selectedPost.id) {
					return {
						...post,
						comments: [...(post.comments || []), newComment],
					};
				}
				return post;
			});

			// Update UI immediately
			setPosts(updatedPosts);
			setCommentText('');

			// Save to localStorage after UI update
			let savedSuccessfully = false;
			let attempts = 0;
			const maxAttempts = 3;

			while (!savedSuccessfully && attempts < maxAttempts) {
				try {
					localStorage.setItem('posts', JSON.stringify(updatedPosts));
					savedSuccessfully = true;
				} catch (storageError) {
					attempts++;
					// Progressive cleanup strategy
					let postsToKeep;
					if (attempts === 1) {
						// First attempt: keep 75% of posts
						postsToKeep = updatedPosts.slice(
							0,
							Math.ceil(updatedPosts.length * 0.75)
						);
					} else if (attempts === 2) {
						// Second attempt: keep 50% of posts
						postsToKeep = updatedPosts.slice(
							0,
							Math.ceil(updatedPosts.length * 0.5)
						);
					} else {
						// Last attempt: keep only 25% of posts (newest ones)
						postsToKeep = updatedPosts.slice(
							0,
							Math.max(1, Math.ceil(updatedPosts.length * 0.25))
						);
					}

					// Try to save the reduced set
					try {
						localStorage.setItem('posts', JSON.stringify(postsToKeep));
						savedSuccessfully = true;
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
					} catch (innerError) {
						// Continue to next attempt
						console.error('Failed cleanup attempt:', innerError);
					}
				}
			}

			// Create notification if it's not the post owner commenting
			if (selectedPost.user.name !== userName) {
				// Get existing notifications or create empty array
				const notifications = JSON.parse(
					localStorage.getItem('notifications') || '[]'
				);

				// Add new notification at the beginning of the array
				notifications.unshift({
					id: Date.now(),
					type: 'comment',
					user: userName,
					postId: selectedPost.id,
					commentId: newComment.id,
					commentText:
						commentText.substring(0, 50) +
						(commentText.length > 50 ? '...' : ''),
					timestamp: new Date().toISOString(),
					read: false,
				});

				// Save updated notifications
				localStorage.setItem('notifications', JSON.stringify(notifications));

				// Dispatch custom event to update notification count
				window.dispatchEvent(new Event('notificationsUpdated'));

				// Show notification to post owner
				toast.info(`${userName} оставил комментарий к вашему посту`, {
					position: 'top-right',
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					theme: darkMode ? 'dark' : 'light',
				});
			}

			// Show success toast
			toast.success('Комментарий успешно добавлен!', {
				position: 'top-right',
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: darkMode ? 'dark' : 'light',
			});
		} catch (error) {
			console.error('Error adding comment:', error);
			toast.error('Ошибка при добавлении комментария', {
				position: 'top-right',
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: darkMode ? 'dark' : 'light',
			});
		}
	};

	const handleDeleteComment = (postId, commentId) => {
		try {
			// Get the comment before deleting it
			const postToUpdate = posts.find((post) => post.id === postId);
			const commentToDelete = postToUpdate?.comments?.find(
				(comment) => comment.id === commentId
			);

			// Update selected post
			if (selectedPost && selectedPost.id === postId) {
				setSelectedPost((prev) => ({
					...prev,
					comments: prev.comments.filter((comment) => comment.id !== commentId),
				}));
			}

			// Update posts state
			const updatedPosts = posts.map((post) => {
				if (post.id === postId) {
					return {
						...post,
						comments: post.comments.filter(
							(comment) => comment.id !== commentId
						),
					};
				}
				return post;
			});

			// Update UI immediately
			setPosts(updatedPosts);

			// Save to localStorage and show toast after UI update
			try {
				localStorage.setItem('posts', JSON.stringify(updatedPosts));

				// Also remove any notifications related to this comment
				if (commentToDelete) {
					const notifications = JSON.parse(
						localStorage.getItem('notifications') || '[]'
					);
					const filteredNotifications = notifications.filter(
						(notification) =>
							!(
								notification.commentId === commentId &&
								notification.postId === postId
							)
					);

					if (filteredNotifications.length !== notifications.length) {
						localStorage.setItem(
							'notifications',
							JSON.stringify(filteredNotifications)
						);
						// Dispatch custom event to update notification count
						window.dispatchEvent(new Event('notificationsUpdated'));
					}
				}
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
			toast.success('Комментарий успешно удален!', {
				position: 'top-right',
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: darkMode ? 'dark' : 'light',
			});
		} catch (error) {
			console.error('Error deleting comment:', error);
			toast.error('Ошибка при удалении комментария', {
				position: 'top-right',
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: darkMode ? 'dark' : 'light',
			});
		}
	};

	const handlePostMenuOpen = (event, post) => {
		event.stopPropagation();
		setAnchorEl(event.currentTarget);
		setSelectedPostForMenu(post);
	};

	const handlePostMenuClose = () => {
		setAnchorEl(null);
		setSelectedPostForMenu(null);
	};

	const handleEditPost = (post) => {
		navigate('/create-post', { state: { editPost: post } });
		handlePostMenuClose();
		// Show toast notification when navigating to edit post
		toast.info('Редактирование поста...', {
			position: 'top-right',
			autoClose: 2000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			theme: darkMode ? 'dark' : 'light',
		});
	};

	const handleSaveEdit = () => {
		const updatedPosts = posts.map((post) => {
			if (post.id === editingPost.id) {
				return {
					...post,
					description: editText,
					edited: true,
				};
			}
			return post;
		});
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
		setEditingPost(null);
		setEditText('');

		// Show success toast notification
		toast.success('Пост успешно отредактирован!', {
			position: 'top-right',
			autoClose: 3000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			theme: darkMode ? 'dark' : 'light',
		});
	};

	const handleDeletePost = (postId) => {
		const updatedPosts = posts.filter((post) => post.id !== postId);
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
		handlePostMenuClose();
		toast.success('Пост успешно удален!', {
			position: 'top-right',
			autoClose: 3000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			theme: darkMode ? 'dark' : 'light',
		});
	};

	const formatTimestamp = (timestamp) => {
		try {
			if (!timestamp) return 'Invalid date';
			const date = new Date(timestamp);
			if (isNaN(date.getTime())) return 'Invalid date';
			return format(date, 'dd MMMM в HH:mm', { locale: ru });
		} catch (error) {
			console.error('Error formatting timestamp:', error);
			return 'Invalid date';
		}
	};

	return (
		<>
			<StoriesBar darkMode={darkMode} />
			<Box
				component={motion.div}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
				sx={{
					padding: { xs: 1, sm: 2, md: 3 },
					backgroundColor: darkMode ? '#121212' : '#f5f5f5',
					minHeight: '100vh',
				}}
			>
				{loading ? (
					<Box
						display='flex'
						justifyContent='center'
						alignItems='center'
						minHeight='60vh'
					>
						<TetrisLoader darkMode={darkMode} />
					</Box>
				) : error ? (
					<Box
						display='flex'
						justifyContent='center'
						alignItems='center'
						minHeight='60vh'
					>
						<Typography color='error'>{error}</Typography>
					</Box>
				) : (
					<Box
						sx={{
							maxWidth: 600,
							margin: '0 auto',
							width: '100%',
						}}
					>
						{posts.map((post) => (
							<PostCard
								key={post.id}
								post={post}
								darkMode={darkMode}
								currentUser={currentUser}
								onLike={handleLike}
								onOpenComments={handleOpenComments}
								onMenuOpen={handlePostMenuOpen}
								formatTimestamp={formatTimestamp}
							/>
						))}
					</Box>
				)}

				<Menu
					anchorEl={anchorEl}
					open={Boolean(anchorEl)}
					onClose={handlePostMenuClose}
					PaperProps={{
						sx: {
							backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
							color: darkMode ? '#ffffff' : '#000000',
						},
					}}
				>
					<MenuItem onClick={() => handleEditPost(selectedPostForMenu)}>
						<EditIcon sx={{ mr: 1 }} />
						Редактировать
					</MenuItem>
					<MenuItem
						onClick={() => handleDeletePost(selectedPostForMenu.id)}
						sx={{ color: 'error.main' }}
					>
						<DeleteIcon sx={{ mr: 1 }} />
						Удалить
					</MenuItem>
				</Menu>

				<CommentModal
					open={Boolean(selectedPost)}
					onClose={handleCloseComments}
					darkMode={darkMode}
					selectedPost={selectedPost}
					commentText={commentText}
					onCommentChange={(e) => setCommentText(e.target.value)}
					onAddComment={handleAddComment}
					onDeleteComment={handleDeleteComment}
				/>
			</Box>
		</>
	);
};

export default Home;
