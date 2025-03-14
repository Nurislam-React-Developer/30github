import AccountBoxIcon from '@mui/icons-material/AccountBox';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import EditIcon from '@mui/icons-material/Edit';
import GridViewIcon from '@mui/icons-material/GridView';
import {
	Avatar,
	Box,
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	Paper,
	Tab,
	Tabs,
	TextField,
	Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CommentList from '../components/ui/CommentList';

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
		localStorage.getItem('profileAvatar') || '/logo.png'
	);

	const [isAvatarLoading, setIsAvatarLoading] = useState(false);
	const [tabValue, setTabValue] = useState(0);
	const [userPosts, setUserPosts] = useState([]);
	const [postsCount, setPostsCount] = useState(0);
	const [followersCount, setFollowersCount] = useState(0);
	const [followingCount, setFollowingCount] = useState(0);
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [editName, setEditName] = useState('');
	const [editUsername, setEditUsername] = useState('');
	const [editBio, setEditBio] = useState('');

	useEffect(() => {
		try {
			const postsData = localStorage.getItem('posts');
			const userData = localStorage.getItem('user');
			const userName = localStorage.getItem('profileName');

			const allPosts = postsData ? JSON.parse(postsData) : [];
			let currentUser;
			try {
				currentUser = userData ? JSON.parse(userData) : null;
			} catch (parseError) {
				console.error('Error parsing user data:', parseError);
				currentUser = null;
			}

			if (!currentUser) {
				currentUser = {
					name: localStorage.getItem('profileName') || 'Default Name',
					avatar: localStorage.getItem('profileAvatar') || '/logo.png',
				};
			}

			const filteredPosts = allPosts.filter(
				(post) =>
					post?.user?.name === userName ||
					post?.user?.name === currentUser?.name
			);

			setUserPosts(filteredPosts);
			setPostsCount(filteredPosts.length);
			setFollowersCount(Math.floor(Math.random() * 500) + 50);
			setFollowingCount(Math.floor(Math.random() * 300) + 20);
		} catch (error) {
			console.error('Error loading user data:', error);
			setUserPosts([]);
			setPostsCount(0);
		}
	}, []);

	const handleAvatarUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			setIsAvatarLoading(true);
			const reader = new FileReader();
			reader.onloadend = () => {
				// Create an image element for compression
				const img = new Image();
				img.onload = () => {
					// Create canvas for compression
					const canvas = document.createElement('canvas');
					const ctx = canvas.getContext('2d');

					// Calculate new dimensions (max 800x800)
					let width = img.width;
					let height = img.height;
					const maxSize = 800;

					if (width > height) {
						if (width > maxSize) {
							height *= maxSize / width;
							width = maxSize;
						}
					} else {
						if (height > maxSize) {
							width *= maxSize / height;
							height = maxSize;
						}
					}

					// Set canvas dimensions and draw image
					canvas.width = width;
					canvas.height = height;
					ctx.drawImage(img, 0, 0, width, height);

					// Get compressed base64 string
					const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);

					try {
						// Update state and localStorage
						setAvatar(compressedBase64);
						localStorage.setItem('profileAvatar', compressedBase64);
						localStorage.setItem('userAvatar', compressedBase64);

						// Update userSettings
						const userSettings = localStorage.getItem('userSettings');
						let parsedSettings = {};
						try {
							parsedSettings = userSettings
								? JSON.parse(userSettings)
								: {
										name: editName,
										username: editUsername,
										avatar: avatar,
								  };
						} catch (error) {
							console.error('Error parsing user settings:', error);
							parsedSettings = {
								name: editName,
								username: editUsername,
								avatar: avatar,
							};
						}
						parsedSettings.avatar = compressedBase64;
						localStorage.setItem(
							'userSettings',
							JSON.stringify(parsedSettings)
						);

						// Show success message
						toast.success('Профиль успешно обновлен!');
					} catch (error) {
						console.error('Error saving avatar:', error);
						toast.error(
							'Ошибка при сохранении аватара. Попробуйте изображение меньшего размера.'
						);
					}

					setIsAvatarLoading(false);
					// Removed setOpenEditDialog(false) to keep the modal open
				};
				img.src = reader.result;
			};
			reader.readAsDataURL(file);
		}
	};

	const handleOpenEditDialog = () => {
		setEditName(name);
		setEditUsername(username);
		setEditBio(bio);
		setOpenEditDialog(true);
	};

	const handleCloseEditDialog = () => {
		setOpenEditDialog(false);
	};

	const handleSaveProfile = () => {
		// Update local state
		setName(editName);
		setUsername(editUsername);
		setBio(editBio);

		try {
			// Update localStorage
			localStorage.setItem('profileName', editName);
			localStorage.setItem('profileUsername', editUsername);
			localStorage.setItem('profileBio', editBio);

			// Try to save avatar - this might cause quota issues
			try {
				localStorage.setItem('profileAvatar', avatar);
				localStorage.setItem('userAvatar', avatar);
			} catch (avatarError) {
				console.error('Error saving avatar to localStorage:', avatarError);
				// Continue with other operations even if avatar save fails
			}

			// Update userSettings in localStorage
			const userSettings = localStorage.getItem('userSettings');
			let parsedSettings;
			try {
				parsedSettings = userSettings
					? JSON.parse(userSettings)
					: {
							name: editName,
							username: editUsername,
							avatar: avatar,
					  };
			} catch (error) {
				console.error('Error parsing user settings:', error);
				parsedSettings = {
					name: editName,
					username: editUsername,
					avatar: avatar,
				};
			}

			parsedSettings.name = editName;
			parsedSettings.username = editUsername;

			// Try to save avatar to settings
			try {
				parsedSettings.avatar = avatar;
			} catch (settingsAvatarError) {
				console.error('Error saving avatar to settings:', settingsAvatarError);
			}

			localStorage.setItem('userSettings', JSON.stringify(parsedSettings));

			// Update user data in localStorage
			const userData = localStorage.getItem('user');
			let parsedUserData;
			try {
				parsedUserData = userData
					? JSON.parse(userData)
					: {
							name: editName,
							avatar: avatar,
					  };
			} catch (error) {
				console.error('Error parsing user data:', error);
				parsedUserData = {
					name: editName,
					avatar: avatar,
				};
			}

			parsedUserData.name = editName;

			// Try to save avatar to user data
			try {
				parsedUserData.avatar = avatar;
			} catch (userAvatarError) {
				console.error('Error saving avatar to user data:', userAvatarError);
			}

			localStorage.setItem('user', JSON.stringify(parsedUserData));

			// Show success message
			toast.success('Профиль успешно обновлен!');
		} catch (error) {
			console.error('Error saving profile data:', error);
			toast.error(
				'Ошибка при сохранении данных профиля. Возможно, превышен лимит хранилища.'
			);
		}

		// Close dialog regardless of success/failure
		setOpenEditDialog(false);
	};

	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
	};

	const [selectedPost, setSelectedPost] = useState(null);

	const handlePostClick = (post) => {
		setSelectedPost(post);
	};

	const handleClosePost = () => {
		setSelectedPost(null);
	};

	return (
		<Box sx={{ bgcolor: '#fafafa', minHeight: '100vh', pt: 3 }}>
			<Paper
				elevation={0}
				sx={{
					padding: { xs: 2, sm: 3 },
					borderRadius: 0,
					maxWidth: 935,
					width: '100%',
					margin: '0 auto',
					bgcolor: '#ffffff',
				}}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: { xs: 'column', md: 'row' },
						alignItems: { xs: 'center', md: 'flex-start' },
						mb: 4,
						gap: { xs: 3, md: 4 },
					}}
				>
					<Box sx={{ position: 'relative' }}>
						<Avatar
							src={avatar}
							alt='User Avatar'
							sx={{
								width: { xs: 77, sm: 150 },
								height: { xs: 77, sm: 150 },
								border: '1px solid #dbdbdb',
							}}
						/>
						{isAvatarLoading && (
							<CircularProgress
								size={40}
								sx={{
									position: 'absolute',
									top: '50%',
									left: '50%',
									marginTop: '-20px',
									marginLeft: '-20px',
								}}
							/>
						)}
					</Box>

					<Box sx={{ flex: 1 }}>
						<Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
							<Typography
								variant='h6'
								component='h1'
								sx={{
									fontWeight: 400,
									color: '#262626',
									fontSize: '20px',
								}}
							>
								{username}
							</Typography>

							<Button
								variant='outlined'
								size='small'
								onClick={handleOpenEditDialog}
								sx={{
									borderColor: '#dbdbdb',
									color: '#262626',
									textTransform: 'none',
									fontWeight: 600,
									fontSize: '14px',
									padding: '5px 9px',
									'&:hover': {
										borderColor: '#dbdbdb',
										bgcolor: 'rgba(0,0,0,0.05)',
									},
								}}
							>
								Редактировать профиль
							</Button>
						</Box>

						<Box sx={{ display: 'flex', gap: 5, mb: 3 }}>
							<Typography component='span'>
								<Box component='span' sx={{ fontWeight: 600, mr: 1 }}>
									{postsCount}
								</Box>
								публикаций
							</Typography>
							<Typography component='span'>
								<Box component='span' sx={{ fontWeight: 600, mr: 1 }}>
									{followersCount}
								</Box>
								подписчиков
							</Typography>
							<Typography component='span'>
								<Box component='span' sx={{ fontWeight: 600, mr: 1 }}>
									{followingCount}
								</Box>
								подписок
							</Typography>
						</Box>

						<Box sx={{ mb: 4 }}>
							<Typography sx={{ fontWeight: 600, color: '#262626', mb: 1 }}>
								{name}
							</Typography>
							<Typography sx={{ whiteSpace: 'pre-line', color: '#262626' }}>
								{bio}
							</Typography>
						</Box>
					</Box>
				</Box>

				<Box sx={{ borderTop: 1, borderColor: '#dbdbdb' }}>
					<Tabs
						value={tabValue}
						onChange={handleTabChange}
						centered
						variant='fullWidth'
						sx={{
							borderColor: '#dbdbdb',
							'& .MuiTabs-indicator': {
								backgroundColor: '#262626',
							},
							'& .MuiTab-root': {
								textTransform: 'none',
								fontSize: '12px',
								fontWeight: 500,
								color: '#8e8e8e',
								'&.Mui-selected': {
									color: '#262626',
								},
							},
						}}
					>
						<Tab
							icon={<GridViewIcon />}
							label='Публикации'
							sx={{ minHeight: 48 }}
						/>
						<Tab
							icon={<BookmarkBorderIcon />}
							label='Сохраненное'
							sx={{ minHeight: 48 }}
						/>
						<Tab
							icon={<AccountBoxIcon />}
							label='Отметки'
							sx={{ minHeight: 48 }}
						/>
					</Tabs>
				</Box>

				<Grid container spacing={2} sx={{ mt: 2 }}>
					{userPosts.map((post) => (
						<Grid item xs={4} key={post.id}>
							<Box
								component={motion.div}
								whileHover={{ opacity: 0.8 }}
								sx={{
									position: 'relative',
									paddingTop: '100%',
									cursor: 'pointer',
								}}
								onClick={() => handlePostClick(post)}
							>
								<Box
									component='img'
									src={post.image}
									alt='Post'
									sx={{
										position: 'absolute',
										top: 0,
										left: 0,
										width: '100%',
										height: '100%',
										objectFit: 'cover',
									}}
								/>
							</Box>
						</Grid>
					))}
				</Grid>

				<Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
					<DialogTitle>Редактировать профиль</DialogTitle>
					<DialogContent>
						<TextField
							autoFocus
							margin='dense'
							label='Имя'
							type='text'
							fullWidth
							value={editName}
							onChange={(e) => setEditName(e.target.value)}
						/>
						<TextField
							margin='dense'
							label='Имя пользователя'
							type='text'
							fullWidth
							value={editUsername}
							onChange={(e) => setEditUsername(e.target.value)}
						/>
						<TextField
							margin='dense'
							label='О себе'
							type='text'
							fullWidth
							multiline
							rows={4}
							value={editBio}
							onChange={(e) => setEditBio(e.target.value)}
						/>
						<input
							accept='image/*'
							type='file'
							id='avatar-upload'
							style={{ display: 'none' }}
							onChange={handleAvatarUpload}
						/>
						<label htmlFor='avatar-upload'>
							<Button
								component='span'
								variant='outlined'
								startIcon={<EditIcon />}
								sx={{ mt: 2 }}
							>
								Изменить фото
							</Button>
						</label>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleCloseEditDialog}>Отмена</Button>
						<Button onClick={handleSaveProfile} color='primary'>
							Сохранить
						</Button>
					</DialogActions>
				</Dialog>

				<Dialog
					open={Boolean(selectedPost)}
					onClose={handleClosePost}
					maxWidth='md'
					fullWidth
				>
					{selectedPost && (
						<Box sx={{ display: 'flex', height: '80vh' }}>
							<Box
								sx={{
									flex: 1,
									bgcolor: '#000',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<img
									src={selectedPost.image}
									alt='Post'
									style={{
										maxWidth: '100%',
										maxHeight: '100%',
										objectFit: 'contain',
									}}
								/>
							</Box>
							<Box
								sx={{
									width: 350,
									p: 2,
									borderLeft: 1,
									borderColor: 'divider',
									bgcolor: 'background.paper',
								}}
							>
								<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
									<Avatar
										src={selectedPost.user?.avatar}
										sx={{ width: 32, height: 32, mr: 1 }}
									/>
									<Typography variant='subtitle2'>
										{selectedPost.user?.name}
									</Typography>
								</Box>
								<Typography variant='body2' sx={{ mb: 2 }}>
									{selectedPost.description}
								</Typography>
								<Box sx={{ flex: 1, overflowY: 'auto', mt: 2 }}>
									<Typography variant='subtitle2' sx={{ mb: 1 }}>
										Комментарии
									</Typography>
									<CommentList
										comments={selectedPost.comments || []}
										darkMode={false}
										onDeleteComment={(postId, commentId) => {
											const updatedPosts = userPosts.map((post) => {
												if (post.id === postId) {
													return {
														...post,
														comments: post.comments.filter(
															(c) => c.id !== commentId
														),
													};
												}
												return post;
											});
											setUserPosts(updatedPosts);
											localStorage.setItem(
												'posts',
												JSON.stringify(updatedPosts)
											);
										}}
										postId={selectedPost.id}
									/>
								</Box>
								<Box
									sx={{ mt: 2, borderTop: 1, borderColor: 'divider', pt: 2 }}
								>
									<Typography variant='caption' color='text.secondary'>
										{new Date(selectedPost.timestamp).toLocaleDateString()}
									</Typography>
								</Box>
							</Box>
						</Box>
					)}
				</Dialog>
			</Paper>
		</Box>
	);
};

export default Profile;
