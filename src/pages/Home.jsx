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

		const handleLike = (postId) => {
		const updatedPosts = posts.map(post => {
			if (post.id === postId) {
				return { ...post, likes: post.likes + 1 };
			}
			return post;
		});
		setPosts(updatedPosts);
		localStorage.setItem('posts', JSON.stringify(updatedPosts));
	};

	const handleComment = (postId) => {
		const updatedPosts = posts.map(post => {
			if (post.id === postId) {
				return { ...post, comments: post.comments + 1 };
			}
			return post;
		});
		setPosts(updatedPosts);
		localStorage.setItem('posts', JSON.stringify(updatedPosts));
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
									onClick={() => handleLike(post.id)}
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
