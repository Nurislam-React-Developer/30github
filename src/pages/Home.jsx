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

const Home = () => {
	const { darkMode } = useTheme();
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
			return [...parsedPosts, ...initialPosts];
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
						name: 'Текущий пользователь',
						avatar: 'https://i.pravatar.cc/150?img=3'
					},
					text: commentText,
					timestamp: 'Только что'
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
	

				{/* Лента постов */}
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
						{/* Add comment form */}
						<Box sx={{ p: 2 }}>
							<TextField
								fullWidth
								placeholder="Add a comment..."
								variant="outlined"
								size="small"
								sx={{
									backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
									'& .MuiOutlinedInput-root': {
										'& fieldset': {
											borderColor: darkMode ? '#bb86fc' : '#3f51b5'
										},
										'&:hover fieldset': {
											borderColor: darkMode ? '#bb86fc' : '#3f51b5'
										},
										'&.Mui-focused fieldset': {
											borderColor: darkMode ? '#bb86fc' : '#3f51b5'
										}
									},
									'& .MuiInputBase-input': {
										color: darkMode ? '#ffffff' : '#000000'
									}
								}}
							/>
						</Box>
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
									onClick={() => handleComment(post.id)}
								>
									<CommentIcon />
									<Typography
										variant="caption"
										component="span"
										sx={{ ml: 1 }}
									>
										{post.comments}
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
		</Box>
	);
};

export default Home;
