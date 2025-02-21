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
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import { motion } from 'framer-motion';
import { useTheme } from '../theme/ThemeContext';

const Home = () => {
	const { darkMode } = useTheme();
	const [posts, setPosts] = useState([
		{
			id: 1,
			user: {
				name: 'Анна Смирнова',
				avatar: 'https://i.pravatar.cc/150?img=1',
			},
			image: 'https://source.unsplash.com/random/800x600?nature',
			description: 'Прекрасный день на природе! 🌿',
			likes: 42,
			comments: 8,
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
			comments: 5,
			timestamp: '4 часа назад',
		},
	]);

	const [newPost, setNewPost] = useState({
		image: '',
		description: '',
	});

	const handleCreatePost = () => {
		if (newPost.description.trim()) {
			const post = {
				id: posts.length + 1,
				user: {
					name: localStorage.getItem('profileName') || 'Пользователь',
					avatar: localStorage.getItem('profileAvatar') || 'https://i.pravatar.cc/150?img=3',
				},
				image: newPost.image || 'https://source.unsplash.com/random/800x600?random',
				description: newPost.description,
				likes: 0,
				comments: 0,
				timestamp: 'Только что',
			};
			setPosts([post, ...posts]);
			setNewPost({ image: '', description: '' });
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
			<Box
				sx={{
					maxWidth: 600,
					margin: '0 auto',
					width: '100%',
				}}
			>
				{/* Форма создания поста */}
				<Paper
					elevation={3}
					component={motion.div}
					whileHover={{ y: -2 }}
					sx={{
						p: 2,
						mb: 3,
						backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
					}}
				>
					<Typography
						variant="h6"
						gutterBottom
						sx={{ color: darkMode ? '#ffffff' : '#000000' }}
					>
						Создать пост
					</Typography>
					<TextField
						fullWidth
						multiline
						rows={3}
						placeholder="Что у вас нового?"
						value={newPost.description}
						onChange={(e) =>
							setNewPost({ ...newPost, description: e.target.value })
						}
						margin="normal"
						variant="outlined"
						sx={{
							'& .MuiOutlinedInput-root': {
								'& fieldset': {
									borderColor: darkMode ? '#bb86fc' : '#3f51b5',
								},
								'&:hover fieldset': {
									borderColor: darkMode ? '#bb86fc' : '#3f51b5',
								},
								'&.Mui-focused fieldset': {
									borderColor: darkMode ? '#bb86fc' : '#3f51b5',
								},
							},
							'& .MuiInputBase-input': {
								color: darkMode ? '#ffffff' : '#000000',
							},
						}}
					/>
					<Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
						<Button
							variant="contained"
							onClick={handleCreatePost}
							size="large"
							sx={{
								backgroundColor: darkMode ? '#bb86fc' : '#3f51b5',
								'&:hover': {
									backgroundColor: darkMode ? '#9c27b0' : '#303f9f',
								},
							}}
						>
							Опубликовать
						</Button>
					</Box>
				</Paper>

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
