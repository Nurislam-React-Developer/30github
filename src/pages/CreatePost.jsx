import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import {
	Box,
	Button,
	CircularProgress,
	IconButton,
	Paper,
	styled,
	TextField,
	Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { selectCurrentUser } from '../store/userSlice';
import { useTheme } from '../theme/ThemeContext';

const CreatePost = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { darkMode } = useTheme();
	const currentUser = useSelector(selectCurrentUser);
	const editPost = location.state?.editPost;

	const [postData, setPostData] = useState({
		description: '',
		image: null,
		imagePreview: null,
	});

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPostData((prev) => ({
					...prev,
					image: file,
					imagePreview: reader.result,
				}));
			};
			reader.readAsDataURL(file);
		}
	};

	useEffect(() => {
		if (editPost) {
			setPostData({
				description: editPost.description,
				image: null,
				imagePreview: editPost.image,
			});
		}
	}, [editPost]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (
			!postData.description.trim() &&
			!postData.image &&
			!postData.imagePreview
		) {
			toast.error('Пожалуйста, добавьте описание или изображение');
			return;
		}

		// Add notification handlers for likes and comments
		const addNotification = (type, sender, postId, comment = '') => {
			const notification = {
				id: Date.now(),
				type,
				sender,
				senderAvatar:
					currentUser?.avatar ||
					localStorage.getItem('profileAvatar') ||
					'/logo.png',
				postId,
				comment,
				timestamp: new Date().toISOString(),
			};

			const notifications = JSON.parse(
				localStorage.getItem('notifications') || '[]'
			);
			notifications.unshift(notification);
			localStorage.setItem('notifications', JSON.stringify(notifications));
		};

		try {
			// Compress image if present
			let compressedImage = postData.imagePreview;
			if (postData.imagePreview) {
				try {
					const img = new Image();
					img.src = postData.imagePreview;

					// Wait for image to load before processing
					await new Promise((resolve, reject) => {
						img.onload = resolve;
						img.onerror = reject;
					});

					const canvas = document.createElement('canvas');
					const ctx = canvas.getContext('2d');

					// Set maximum dimensions
					const maxWidth = 1200;
					const maxHeight = 1800;
					let width = img.width;
					let height = img.height;

					// Calculate new dimensions
					if (width > height) {
						if (width > maxWidth) {
							height *= maxWidth / width;
							width = maxWidth;
						}
					} else {
						if (height > maxHeight) {
							width *= maxHeight / height;
							height = maxHeight;
						}
					}

					canvas.width = width;
					canvas.height = height;
					ctx.drawImage(img, 0, 0, width, height);

					// Compress image to JPEG with lower quality (0.8 instead of 0.95) to reduce size
					compressedImage = canvas.toDataURL('image/jpeg', 0.8);
				} catch (compressionError) {
					console.error('Error compressing image:', compressionError);
					// Use original image if compression fails
					compressedImage = postData.imagePreview;
				}
			}

			const post = editPost
				? {
						...editPost,
						description: postData.description,
						image: compressedImage || editPost.image,
						edited: true,
				  }
				: {
						id: Date.now(),
						user: {
							name:
								currentUser?.name ||
								localStorage.getItem('profileName') ||
								'Пользователь',
							avatar:
								currentUser?.avatar ||
								localStorage.getItem('profileAvatar') ||
								'/logo.png',
						},
						image: compressedImage,
						description: postData.description,
						likes: 0,
						comments: [],
						timestamp: new Date().toISOString(),
				  };

			const existingPosts = JSON.parse(localStorage.getItem('posts') || '[]');

			const updatedPosts = editPost
				? existingPosts.map((p) => (p.id === editPost.id ? post : p))
				: [post, ...existingPosts.slice(0, 19)];

			try {
				localStorage.setItem('posts', JSON.stringify(updatedPosts));
			} catch (storageError) {
				// If storage is full, try with more aggressive compression
				if (compressedImage && post.image) {
					try {
						const canvas = document.createElement('canvas');
						const ctx = canvas.getContext('2d');
						const img = new Image();
						img.src = compressedImage;

						// Wait for image to load
						await new Promise((resolve) => {
							img.onload = resolve;
						});

						// Reduce dimensions further
						const maxWidth = 800;
						const maxHeight = 1200;
						let width = img.width;
						let height = img.height;

						if (width > height) {
							if (width > maxWidth) {
								height *= maxWidth / width;
								width = maxWidth;
							}
						} else {
							if (height > maxHeight) {
								width *= maxHeight / height;
								height = maxHeight;
							}
						}

						canvas.width = width;
						canvas.height = height;
						ctx.drawImage(img, 0, 0, width, height);

						// Use much lower quality
						post.image = canvas.toDataURL('image/jpeg', 0.5);

						// Try saving again with more compressed image
						const updatedPostsWithCompressedImage = editPost
							? existingPosts.map((p) => (p.id === editPost.id ? post : p))
							: [post, ...existingPosts.slice(0, 9)]; // Keep fewer posts

						localStorage.setItem(
							'posts',
							JSON.stringify(updatedPostsWithCompressedImage)
						);
					} catch (e) {
						// If still failing, remove older posts until it fits
						while (updatedPosts.length > 1) {
							updatedPosts.pop(); // Remove the oldest post
							try {
								localStorage.setItem('posts', JSON.stringify(updatedPosts));
								break;
							} catch (e) {
								continue;
							}
						}
					}
				} else {
					// If no image or compression failed, just remove older posts
					while (updatedPosts.length > 1) {
						updatedPosts.pop(); // Remove the oldest post
						try {
							localStorage.setItem('posts', JSON.stringify(updatedPosts));
							break;
						} catch (e) {
							continue;
						}
					}
				}

				if (updatedPosts.length <= 1) {
					throw new Error('Unable to save post due to storage limitations');
				}
			}

			toast.success(
				editPost ? 'Пост успешно обновлен!' : 'Пост успешно создан!',
				{
					position: 'top-right',
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					theme: darkMode ? 'dark' : 'light',
				}
			);
			navigate('/');
		} catch (error) {
			console.error('Error saving post:', error);
			toast.error('Не удалось сохранить пост: ' + error.message, {
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

	return (
		<Container darkMode={darkMode}>
			<StyledPaper
				elevation={3}
				component={motion.div}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				darkMode={darkMode}
			>
				<Typography
					variant='h4'
					gutterBottom
					align='center'
					color={darkMode ? '#fff' : '#000'}
				>
					{editPost ? 'Редактировать пост' : 'Создать новый пост'}
				</Typography>

				<form onSubmit={handleSubmit}>
					<TextField
						fullWidth
						multiline
						rows={4}
						placeholder='Что у вас нового?'
						value={postData.description}
						onChange={(e) =>
							setPostData((prev) => ({ ...prev, description: e.target.value }))
						}
						sx={{
							mb: 2,
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
								color: darkMode ? '#fff' : '#000',
							},
						}}
					/>

					<Box sx={{ mb: 2, textAlign: 'center' }}>
						<input
							accept='image/*'
							type='file'
							id='image-upload'
							style={{ display: 'none' }}
							onChange={handleImageChange}
						/>
						<label htmlFor='image-upload'>
							<IconButton
								component='span'
								sx={{
									backgroundColor: darkMode ? '#bb86fc20' : '#3f51b520',
									'&:hover': {
										backgroundColor: darkMode ? '#bb86fc40' : '#3f51b540',
									},
								}}
							>
								<AddPhotoAlternateIcon
									sx={{ fontSize: 40, color: darkMode ? '#bb86fc' : '#3f51b5' }}
								/>
							</IconButton>
						</label>
					</Box>

					{postData.imagePreview && (
						<Box
							component={motion.div}
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							sx={{ mb: 2, textAlign: 'center' }}
						>
							<img
								src={postData.imagePreview}
								alt='Preview'
								style={{
									maxWidth: '100%',
									maxHeight: '300px',
									borderRadius: '8px',
									boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
								}}
							/>
						</Box>
					)}

					<Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
						<SubmitButton darkMode={darkMode} />
						<Button
							variant='outlined'
							onClick={() => navigate('/')}
							sx={{
								color: darkMode ? '#bb86fc' : '#3f51b5',
								borderColor: darkMode ? '#bb86fc' : '#3f51b5',
								'&:hover': {
									borderColor: darkMode ? '#9c27b0' : '#303f9f',
								},
							}}
						>
							Отмена
						</Button>
					</Box>
				</form>
			</StyledPaper>
		</Container>
	);
};

// Компонент кнопки отправки с индикатором загрузки
const SubmitButton = ({ darkMode }) => {
	const { pending } = useFormStatus();

	return (
		<Button
			variant='contained'
			type='submit'
			disabled={pending}
			sx={{
				bgcolor: darkMode ? '#bb86fc' : '#3f51b5',
				'&:hover': {
					bgcolor: darkMode ? '#9c27b0' : '#303f9f',
				},
				height: '48px',
			}}
		>
			{pending ? (
				<CircularProgress size={24} sx={{ color: '#fff' }} />
			) : (
				'Опубликовать'
			)}
		</Button>
	);
};

export default CreatePost;

const Container = styled(Box)(({ darkMode }) => ({
	minHeight: '100vh',
	padding: '24px',
	backgroundColor: darkMode ? '#121212' : '#f5f5f5',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'flex-start',
}));

const StyledPaper = styled(Paper)(({ darkMode }) => ({
	padding: '24px',
	maxWidth: '600px',
	width: '100%',
	backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
	marginTop: '20px',
}));
