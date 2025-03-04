import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
	Box,
	Menu,
	MenuItem,
	Typography,
} from '@mui/material';
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
import { selectCurrentUser } from '../store/userSlice';
import { useTheme } from '../theme/ThemeContext';
import TetrisLoader from '../components/ui/TetrisLoader';

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
			const newComment = {
				id: Date.now(),
				user: {
					name: currentUser?.name || localStorage.getItem('profileName') || 'Anonymous',
					avatar: currentUser?.avatar || localStorage.getItem('profileAvatar') || 'https://via.placeholder.com/150',
				},
				text: commentText,
				timestamp: new Date().toISOString(),
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
			localStorage.setItem('posts', JSON.stringify(updatedPosts));

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
			localStorage.setItem('posts', JSON.stringify(updatedPosts));
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
		localStorage.setItem('posts', JSON.stringify(updatedPosts));
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
		localStorage.setItem('posts', JSON.stringify(updatedPosts));
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
	);
};

export default Home;
