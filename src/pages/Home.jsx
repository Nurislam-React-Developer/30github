import React, { useState } from 'react';
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
	Paper,
	Dialog,
	DialogTitle,
	DialogContent,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import { motion } from 'framer-motion';
import { useTheme } from '../theme/ThemeContext';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/userSlice';

const Home = () => {
	const { darkMode } = useTheme();
	const currentUser = useSelector(selectCurrentUser);
	const [selectedPost, setSelectedPost] = useState(null);
	const [commentText, setCommentText] = useState('');
	const [posts, setPosts] = useState(() => {
		// Load posts from localStorage
		const savedPosts = localStorage.getItem('posts');
		const initialPosts = [
			{
				id: 1,
				user: {
					name: 'Анна Смирнова',
					avatar: 'https://i.pravatar.cc/150?img=1',
				},
				image: 'https://source.unsplash.com/random/800x600?nature',
				description: 'Прекрасный день на природе! 🌿',
				likes: 42,
				liked: false,
				comments: [],
				timestamp: '2 часа назад',
			},
			{
				id: 2,
				user: {
					name: 'Максим Петров',
					avatar: 'https://i.pravatar.cc/150?img=2',
				},
				image: 'https://source.unsplash.com/random/800x600?city',
				description: 'Городские приключения продолжаются! 🌆',
				likes: 28,
				liked: false,
				comments: [],
				timestamp: '4 часа назад',
			},
		];
		
		if (savedPosts) {
			const parsedPosts = JSON.parse(savedPosts);
			// Ensure comments array exists for each post
			const postsWithComments = parsedPosts.map(post => ({
				...post,
				comments: Array.isArray(post.comments) ? post.comments : []
			}));
			return [...postsWithComments, ...initialPosts];
		}
		
		return initialPosts;
	});

	const handleLike = (postId) => {
		const updatedPosts = posts.map(post => {
			if (post.id === postId && !post.liked) {
				return { 
					...post, 
					likes: post.likes + 1,
					liked: true
				};
			}
			return post;
		});
		setPosts(updatedPosts);
		localStorage.setItem('posts', JSON.stringify(updatedPosts));
	};

	const handleOpenComments = (post) => {
		setSelectedPost(post);
	};

	const handleCloseComments = () => {
		setSelectedPost(null);
		setCommentText('');
	};

	const handleAddComment = () => {
		if (!commentText.trim()) return;

		const updatedPosts = posts.map(post => {
			if (post.id === selectedPost.id) {
				const newComment = {
					id: Date.now(),
					user: {
						name: currentUser.name,
						avatar: currentUser.avatar
					},
					text: commentText,
					timestamp: new Date().toLocaleString('ru-RU', {
						hour: '2-digit',
						minute: '2-digit'
					})
				};
				return {
					...post,
					comments: [...(post.comments || []), newComment]
				};
			}
			return post;
		});

		setPosts(updatedPosts);
		localStorage.setItem('posts', JSON.stringify(updatedPosts));
		setCommentText('');
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
						<Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
							<Avatar src={post.user.avatar} />
							<Box sx={{ ml: 2 }}>
								<Typography
									variant="subtitle1"
									component="div"
									sx={{ color: darkMode ? '#ffffff' : '#000000' }}
								>
									{post.user.name}
								</Typography>
								<Typography
									variant="caption"
									color="textSecondary"
									component="div"
									sx={{ color: darkMode ? '#bb86fc' : '#3f51b5' }}
								>
									{post.timestamp}
								</Typography>
							</Box>
						</Box>
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
									disabled={post.liked}
									sx={{
										color: post.liked ? '#ff1744' : (darkMode ? '#bb86fc' : '#3f51b5')
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
					</Card>
				))}
			</Box>

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
									'&:hover': {
										backgroundColor: darkMode ? 'rgba(187, 134, 252, 0.08)' : 'rgba(63, 81, 181, 0.08)'
									}
								}}
							>
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
											{comment.timestamp}
										</Typography>
									}
									sx={{
										margin: 0,
										'& .MuiListItemText-secondary': {
											mt: 0.5
										}
									}}
								/>
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
