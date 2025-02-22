import React, { useState, useEffect } from 'react';
import {
	Avatar,
	Button,
	TextField,
	Typography,
	Box,
	styled,
	Tooltip,
	IconButton,
	Switch,
	Paper,
	CircularProgress,
	Card,
	CardContent,
	CardMedia,
	Divider,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { motion } from 'framer-motion'; 

const Profile = () => {
	const navigate = useNavigate();

	const [name, setName] = useState(
		localStorage.getItem('profileName') || 'Default Name'
	);
	const [username, setUsername] = useState(
		localStorage.getItem('profileUsername') || 'default_user'
	);
	const [bio, setBio] = useState(
		localStorage.getItem('profileBio') || 'Напишите что-нибудь о себе...'
	);
	const [avatar, setAvatar] = useState(
		localStorage.getItem('profileAvatar') || 'https://via.placeholder.com/150'
	);

	const [isDarkMode, setIsDarkMode] = useState(
		localStorage.getItem('isDarkMode') === 'true' || false
	);

	const [isAvatarLoading, setIsAvatarLoading] = useState(false);
	const [posts, setPosts] = useState([]);
	const [editingPost, setEditingPost] = useState(null);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [editedDescription, setEditedDescription] = useState('');

	useEffect(() => {
		localStorage.setItem('isDarkMode', isDarkMode);
	}, [isDarkMode]);

	useEffect(() => {
		const savedPosts = localStorage.getItem('posts');
		if (savedPosts) {
			const allPosts = JSON.parse(savedPosts);
			const userPosts = allPosts.filter(post => post.user.name === name);
			setPosts(userPosts);
		}
	}, [name]);

	const handleEditPost = (post) => {
		setEditingPost(post);
		setEditedDescription(post.description);
		setEditDialogOpen(true);
	};

	const handleSaveEdit = () => {
		const savedPosts = JSON.parse(localStorage.getItem('posts') || '[]');
		const updatedPosts = savedPosts.map(post =>
			post.id === editingPost.id
				? { ...post, description: editedDescription }
				: post
		);
		localStorage.setItem('posts', JSON.stringify(updatedPosts));
		setPosts(updatedPosts.filter(post => post.user.name === name));
		setEditDialogOpen(false);
		setEditingPost(null);
		toast.success('Пост успешно обновлен!');
	};

	const handleDeletePost = (postId) => {
		if (window.confirm('Вы уверены, что хотите удалить этот пост?')) {
			const savedPosts = JSON.parse(localStorage.getItem('posts') || '[]');
			const updatedPosts = savedPosts.filter(post => post.id !== postId);
			localStorage.setItem('posts', JSON.stringify(updatedPosts));
			setPosts(updatedPosts.filter(post => post.user.name === name));
			toast.success('Пост успешно удален!');
		}
	};

	const handleNameChange = (e) => setName(e.target.value);
	const handleUsernameChange = (e) => setUsername(e.target.value);

	const handleBioChange = (e) => {
		const value = e.target.value;
		setBio(value); 
	};

	const handleAvatarUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			setIsAvatarLoading(true); 
			const reader = new FileReader();
			reader.onloadend = () => {
				setAvatar(reader.result);
				setIsAvatarLoading(false); 
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSaveData = () => {
		localStorage.setItem('profileName', name);
		localStorage.setItem('profileUsername', username);
		localStorage.setItem('profileBio', bio);
		localStorage.setItem('profileAvatar', avatar);
		toast.success('Данные успешно сохранены!');
	};

	const handleGoHome = () => navigate('/');

	return (
		<ProfileContainer isDarkMode={isDarkMode}>
			<Paper
				elevation={3}
				sx={{
					padding: 4,
					borderRadius: 3,
					maxWidth: 500,
					width: '100%',
					backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
					transition: 'background-color 0.5s ease-in-out',
				}}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5 }}
					>
						<ProfileAvatar src={avatar} alt='User Avatar' />
						{isAvatarLoading && (
							<CircularProgress
								size={40}
								sx={{
									position: 'absolute',
									top: '50%',
									left: '50%',
									marginTop: '-20px',
									marginLeft: '-20px',
									color: isDarkMode ? '#bb86fc' : '#3f51b5',
								}}
							/>
						)}
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2, duration: 0.5 }}
					>
						<Typography
							variant='h5'
							gutterBottom
							sx={{
								fontWeight: 'bold',
								color: isDarkMode ? '#ffffff' : '#3f51b5',
							}}
						>
							{name}
						</Typography>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4, duration: 0.5 }}
					>
						<Typography
							variant='subtitle1'
							gutterBottom
							sx={{ color: isDarkMode ? '#ffffff' : '#000000' }}
						>
							@{username}
						</Typography>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.6, duration: 0.5 }}
					>
						<TextField
							label='Имя'
							value={name}
							onChange={handleNameChange}
							fullWidth
							margin='normal'
							variant='outlined'
							sx={{
								'& .MuiOutlinedInput-root': {
									'& fieldset': {
										borderColor: isDarkMode ? '#bb86fc' : '#3f51b5',
									},
									'&:hover fieldset': {
										borderColor: isDarkMode ? '#bb86fc' : '#3f51b5',
									},
									'&.Mui-focused fieldset': {
										borderColor: isDarkMode ? '#bb86fc' : '#3f51b5',
									},
								},
								'& .MuiInputLabel-root': {
									color: isDarkMode ? '#ffffff' : '#000000',
								},
								'& .MuiInputBase-input': {
									color: isDarkMode ? '#ffffff' : '#000000',
								},
							}}
						/>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.8, duration: 0.5 }}
					>
						<TextField
							label='Никнейм'
							value={username}
							onChange={handleUsernameChange}
							fullWidth
							margin='normal'
							variant='outlined'
							sx={{
								'& .MuiOutlinedInput-root': {
									'& fieldset': {
										borderColor: isDarkMode ? '#bb86fc' : '#3f51b5',
									},
									'&:hover fieldset': {
										borderColor: isDarkMode ? '#bb86fc' : '#3f51b5',
									},
									'&.Mui-focused fieldset': {
										borderColor: isDarkMode ? '#bb86fc' : '#3f51b5',
									},
								},
								'& .MuiInputLabel-root': {
									color: isDarkMode ? '#ffffff' : '#000000',
								},
								'& .MuiInputBase-input': {
									color: isDarkMode ? '#ffffff' : '#000000',
								},
							}}
						/>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 1, duration: 0.5 }}
					>
						<TextField
							label='Описание профиля'
							value={bio}
							onChange={handleBioChange}
							fullWidth
							multiline
							minRows={4} 
							maxRows={8} 
							margin='normal'
							variant='outlined'
							sx={{
								'& .MuiOutlinedInput-root': {
									'& fieldset': {
										borderColor: isDarkMode ? '#bb86fc' : '#3f51b5',
									},
									'&:hover fieldset': {
										borderColor: isDarkMode ? '#bb86fc' : '#3f51b5',
									},
									'&.Mui-focused fieldset': {
										borderColor: isDarkMode ? '#bb86fc' : '#3f51b5',
									},
								},
								'& .MuiInputLabel-root': {
									color: isDarkMode ? '#ffffff' : '#000000',
								},
								'& .MuiInputBase-input': {
									color: isDarkMode ? '#ffffff' : '#000000',
								},
							}}
						/>
					</motion.div>

					<Tooltip title='Загрузить аватар'>
						<Button
							variant='contained'
							component='label'
							sx={{
								marginTop: 2,
								backgroundColor: isDarkMode ? '#bb86fc' : '#3f51b5',
								'&:hover': {
									backgroundColor: isDarkMode ? '#9c27b0' : '#303f9f',
								},
							}}
						>
							Загрузить аватар
							<input type='file' hidden onChange={handleAvatarUpload} />
						</Button>
					</Tooltip>

					<Box sx={{ display: 'flex', gap: 2, marginTop: 3 }}>
						<Button
							variant='contained'
							onClick={handleSaveData}
							sx={{
								backgroundColor: isDarkMode ? '#bb86fc' : '#3f51b5',
								'&:hover': {
									backgroundColor: isDarkMode ? '#9c27b0' : '#303f9f',
								},
							}}
						>
							Сохранить
						</Button>

						<Button
							variant='outlined'
							onClick={handleGoHome}
							sx={{
								borderColor: isDarkMode ? '#bb86fc' : '#3f51b5',
								color: isDarkMode ? '#bb86fc' : '#3f51b5',
								'&:hover': {
									borderColor: isDarkMode ? '#9c27b0' : '#303f9f',
									color: isDarkMode ? '#9c27b0' : '#303f9f',
								},
							}}
						>
							Выйти на главную
						</Button>
					</Box>

					<Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
						<Typography sx={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
							Темная тема
						</Typography>
						<Switch
							checked={isDarkMode}
							onChange={() => setIsDarkMode(!isDarkMode)}
							icon={<Brightness7Icon />}
							checkedIcon={<Brightness4Icon />}
							sx={{
								marginLeft: 1,
								color: isDarkMode ? '#bb86fc' : '#3f51b5',
								'& .MuiSwitch-track': {
									backgroundColor: isDarkMode ? '#bb86fc' : '#3f51b5',
								},
							}}
						/>
					</Box>
				</Box>
			</Paper>

			{/* Posts Section */}
			<Box sx={{ mt: 4, width: '100%', maxWidth: 800, mx: 'auto' }}>
				<Typography variant="h5" gutterBottom sx={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
					Мои посты
				</Typography>
				<Box sx={{ display: 'grid', gap: 3 }}>
					{posts.map((post) => (
						<Card
							key={post.id}
							component={motion.div}
							whileHover={{ y: -2 }}
							sx={{
								backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
							}}
						>
							<Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
								<Box sx={{ display: 'flex', alignItems: 'center' }}>
									<Avatar src={post.user.avatar} />
									<Box sx={{ ml: 2 }}>
										<Typography variant="subtitle1" sx={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
											{post.user.name}
										</Typography>
										<Typography variant="caption" sx={{ color: isDarkMode ? '#bb86fc' : '#3f51b5' }}>
											{post.timestamp}
										</Typography>
									</Box>
								</Box>
								<Box>
									<IconButton onClick={() => handleEditPost(post)} sx={{ color: isDarkMode ? '#bb86fc' : '#3f51b5' }}>
										<EditIcon />
									</IconButton>
									<IconButton onClick={() => handleDeletePost(post.id)} sx={{ color: isDarkMode ? '#f44336' : '#f44336' }}>
										<DeleteIcon />
									</IconButton>
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
								<Typography variant="body1" sx={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
									{post.description}
								</Typography>
								<Divider sx={{ my: 1 }} />
								<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
									<Box sx={{ display: 'flex', alignItems: 'center' }}>
										<IconButton size="small" sx={{ color: isDarkMode ? '#bb86fc' : '#3f51b5' }}>
											<FavoriteIcon />
											<Typography variant="caption" sx={{ ml: 1 }}>{post.likes}</Typography>
										</IconButton>
										<IconButton size="small" sx={{ color: isDarkMode ? '#bb86fc' : '#3f51b5' }}>
											<CommentIcon />
											<Typography variant="caption" sx={{ ml: 1 }}>{post.comments}</Typography>
										</IconButton>
										<IconButton size="small" sx={{ color: isDarkMode ? '#bb86fc' : '#3f51b5' }}>
											<ShareIcon />
										</IconButton>
									</Box>
								</Box>
							</CardContent>
						</Card>
					))}
				</Box>
			</Box>

			{/* Edit Post Dialog */}
			<Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
				<DialogTitle>Редактировать пост</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						label="Описание"
						type="text"
						fullWidth
						multiline
						rows={4}
						value={editedDescription}
						onChange={(e) => setEditedDescription(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setEditDialogOpen(false)}>Отмена</Button>
					<Button onClick={handleSaveEdit} variant="contained" color="primary">Сохранить</Button>
				</DialogActions>
			</Dialog>
		</ProfileContainer>
	);
};


export default Profile;

const ProfileContainer = styled(Box)(({ theme, isDarkMode }) => ({
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	minHeight: '100vh',
	backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
	transition: 'all 0.5s ease-in-out',
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
	width: theme.spacing(15),
	height: theme.spacing(15),
	marginBottom: theme.spacing(2),
	border: '2px solid #3f51b5',
	transition: 'transform 0.3s ease-in-out',
	'&:hover': { transform: 'scale(1.1)' },
}));
