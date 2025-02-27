import React, { useState, useEffect } from 'react';
import {
	Box,
	Card,
	CardContent,
	CardMedia,
	Typography,
	Avatar,
	IconButton,
	TextField,
	Button,
	Divider,
	Dialog,
	DialogTitle,
	DialogContent,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	CircularProgress,
	Menu,
	MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { motion } from 'framer-motion';
import { useTheme } from '../theme/ThemeContext';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/userSlice';
import { getPosts, likePost, getComments, addComment } from '../store/request/api';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

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
			const updatedPosts = posts.map(post => {
				if (post.id === postId) {
					return {
						...post,
						liked: !post.liked,
						likes: post.liked ? post.likes - 1 : post.likes + 1
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
					name: currentUser.name,
					avatar: currentUser.avatar
				},
				text: commentText,
				timestamp: new Date().toISOString()
			};

			const updatedPosts = posts.map(post => {
				if (post.id === selectedPost.id) {
					return {
						...post,
						comments: [...(post.comments || []), newComment]
					};
				}
				return post;
			});

			// Update UI immediately
			setPosts(updatedPosts);
			setCommentText('');

			// Save to localStorage after UI update
			localStorage.setItem('posts', JSON.stringify(updatedPosts));
		} catch (error) {
			console.error('Error adding comment:', error);
			toast.error('Ошибка при добавлении комментария');
		}
	};

	const handleDeleteComment = (postId, commentId) => {
		try {
			const updatedPosts = posts.map(post => {
				if (post.id === postId) {
					return {
						...post,
						comments: post.comments.filter(comment => comment.id !== commentId)
					};
				}
				return post;
			});

			// Update UI immediately
			setPosts(updatedPosts);

			// Save to localStorage and show toast after UI update
			localStorage.setItem('posts', JSON.stringify(updatedPosts));
			toast.success('Комментарий удален!', {
				position: "top-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: darkMode ? 'dark' : 'light'
			});
		} catch (error) {
			console.error('Error deleting comment:', error);
			toast.error('Ошибка при удалении комментария');
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
	};

	const handleSaveEdit = () => {
		const updatedPosts = posts.map(post => {
			if (post.id === editingPost.id) {
				return {
					...post,
					description: editText,
					edited: true
				};
			}
			return post;
		});
		setPosts(updatedPosts);
		localStorage.setItem('posts', JSON.stringify(updatedPosts));
		setEditingPost(null);
		setEditText('');
	};

	const handleDeletePost = (postId) => {
		const updatedPosts = posts.filter(post => post.id !== postId);
		setPosts(updatedPosts);
		localStorage.setItem('posts', JSON.stringify(updatedPosts));
		handlePostMenuClose();
		toast.success('Пост успешно удален!', {
			position: "top-right",
			autoClose: 3000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			theme: darkMode ? 'dark' : 'light'
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
				<Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
					<CircularProgress color={darkMode ? 'secondary' : 'primary'} />
				</Box>
			) : error ? (
				<Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
					<Typography color="error">{error}</Typography>
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
					<Card
						key={post.id}
						component={motion.div}
						whileHover={{ y: -2 }}
						sx={{
							mb: 3,
							backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
						}}
					>
						<Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
							<Box sx={{ display: 'flex', alignItems: 'center' }}>
								<Avatar src={post.user.avatar} />
								<Box sx={{ ml: 2 }}>
									<Typography variant="subtitle1" component="div" sx={{ color: darkMode ? '#ffffff' : '#000000' }}>
										{post.user.name}
									</Typography>
									<Typography variant="caption" color="textSecondary" component="div" sx={{ color: darkMode ? '#bb86fc' : '#3f51b5' }}>
										{formatTimestamp(post.timestamp)}
										{post.edited && ' (изменено)'}
									</Typography>
								</Box>
							</Box>
							{post.user.name === currentUser.name && (
								<IconButton onClick={(e) => handlePostMenuOpen(e, post)}>
									<MoreVertIcon sx={{ color: darkMode ? '#ffffff' : '#000000' }} />
								</IconButton>
							)}
						</Box>
						{editingPost?.id === post.id ? (
							<Box sx={{ p: 2 }}>
								<TextField
									fullWidth
									multiline
									value={editText}
									onChange={(e) => setEditText(e.target.value)}
									sx={{
										mb: 2,
										'& .MuiInputBase-input': {
											color: darkMode ? '#ffffff' : '#000000',
										},
									}}
								/>
								<Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
									<Button onClick={() => setEditingPost(null)}>Отмена</Button>
									<Button variant="contained" onClick={handleSaveEdit}>Сохранить</Button>
								</Box>
							</Box>
						) : (
							<>
								<CardMedia
									component="img"
									image={post.image}
									alt="Post image"
									height="400"
									sx={{ objectFit: 'cover' }}
								/>
								<CardContent>
									<Typography
										variant="body1"
										component="div"
										gutterBottom
										sx={{ color: darkMode ? '#ffffff' : '#000000' }}
									>
										{post.description}
									</Typography>
									<Divider sx={{ my: 1 }} />
									<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
										<IconButton
											size="small"
											color={darkMode ? 'secondary' : 'primary'}
											variant="contained"
											onClick={() => handleLike(post.id)}
											sx={{
												color: post.liked ? '#ff1744' : '#9e9e9e'
											}}
										>
											<FavoriteIcon />
											<Typography
												variant="caption"
												component="span"
												sx={{ ml: 1 }}
											>
												{post.likes}
											</Typography>
										</IconButton>
										<IconButton
											size="small"
											color={darkMode ? 'secondary' : 'primary'}
											onClick={() => handleOpenComments(post)}
										>
											<CommentIcon />
											<Typography
												variant="caption"
												component="span"
												sx={{ ml: 1 }}
											>
												{post.comments?.length || 0}
											</Typography>
										</IconButton>
										<IconButton
											size="small"
											color={darkMode ? 'secondary' : 'primary'}
										>
											<ShareIcon />
										</IconButton>
									</Box>
								</CardContent>
							</>
						)}
					</Card>
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
				<MenuItem onClick={() => handleDeletePost(selectedPostForMenu.id)} sx={{ color: 'error.main' }}>
					<DeleteIcon sx={{ mr: 1 }} />
					Удалить
				</MenuItem>
			</Menu>

			{/* Comments Modal */}
			<Dialog
				open={Boolean(selectedPost)}
				onClose={handleCloseComments}
				fullWidth
				maxWidth="sm"
				PaperProps={{
					sx: {
						backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
						color: darkMode ? '#ffffff' : '#000000'
					}
				}}
			>
				<DialogTitle sx={{ borderBottom: 1, borderColor: 'divider' }}>
					Комментарии
				</DialogTitle>
				<DialogContent>
					<List sx={{ pt: 0, maxHeight: '60vh', overflowY: 'auto' }}>
						{selectedPost?.comments?.map((comment) => (
							<ListItem 
								key={comment.id} 
								alignitems="flex-start"
								sx={{
									py: 0.5,
									display: 'flex',
									justifyContent: 'space-between',
									'&:hover': {
										backgroundColor: darkMode ? 'rgba(187, 134, 252, 0.08)' : 'rgba(63, 81, 181, 0.08)'
									}
								}}
							>
								<Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
									<ListItemAvatar>
										<Avatar 
											src={comment.user.avatar}
											sx={{ width: 32, height: 32 }}
										/>
									</ListItemAvatar>
									<ListItemText
										primary={
											<Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
												<Typography
													component="span"
													variant="subtitle2"
													color={darkMode ? '#ffffff' : 'text.primary'}
													sx={{ fontWeight: 600 }}
												>
													{comment.user.name}
												</Typography>
												<Typography
													component="span"
													variant="body2"
													color={darkMode ? '#ffffff' : 'text.primary'}
												>
													{comment.text}
												</Typography>
											</Box>
										}
										secondary={
											<Typography
												component="span"
												variant="caption"
												color={darkMode ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary'}
											>
												{formatTimestamp(comment.timestamp)}
											</Typography>
										}
										sx={{
											margin: 0,
											'& .MuiListItemText-secondary': {
												mt: 0.5
											}
										}}
									/>
								</Box>
								{comment.user.name === currentUser.name && (
									<IconButton
										size="small"
										onClick={() => handleDeleteComment(selectedPost.id, comment.id)}
										color="error"
										sx={{ ml: 1 }}
									>
										<DeleteIcon fontSize="small" />
									</IconButton>
								)}
							</ListItem>
						))}
					</List>
					<Box sx={{ p: 2, position: 'sticky', bottom: 0, bgcolor: darkMode ? '#1e1e1e' : '#ffffff' }}>
						<Box sx={{ display: 'flex', gap: 1 }}>
							<TextField
								fullWidth
								size="small"
								value={commentText}
								onChange={(e) => setCommentText(e.target.value)}
								placeholder="Добавить комментарий..."
								variant="outlined"
								InputProps={{
									sx: {
										color: darkMode ? '#ffffff' : '#000000',
										'& fieldset': {
											borderColor: darkMode ? '#bb86fc' : '#3f51b5',
										},
									},
								}}
							/>
							<Button
								variant="contained"
								color={darkMode ? 'secondary' : 'primary'}
								onClick={handleAddComment}
								disabled={!commentText.trim()}
							>
								Отправить
							</Button>
						</Box>
					</Box>
				</DialogContent>
			</Dialog>
		</Box>
	);
};

export default Home;
