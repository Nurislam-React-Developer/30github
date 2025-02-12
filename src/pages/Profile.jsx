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
} from '@mui/material';
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

	useEffect(() => {
		localStorage.setItem('isDarkMode', isDarkMode);
	}, [isDarkMode]);

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
