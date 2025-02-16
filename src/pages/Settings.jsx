import React, { useState, useEffect } from 'react';
import {
	Box,
	Typography,
	TextField,
	Button,
	Switch,
	FormControlLabel,
	Divider,
	Avatar,
	IconButton,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Settings = () => {
	// Состояния для полей формы
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [avatar, setAvatar] = useState(null);
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [notificationsEnabled, setNotificationsEnabled] = useState(true);
	const [privacySetting, setPrivacySetting] = useState('public');

	// Загрузка данных из localStorage при монтировании
	useEffect(() => {
		const savedData = JSON.parse(localStorage.getItem('userSettings'));
		if (savedData) {
			setName(savedData.name || '');
			setEmail(savedData.email || '');
			setAvatar(savedData.avatar || null);
			setIsDarkMode(savedData.isDarkMode || false);
			setNotificationsEnabled(savedData.notificationsEnabled || true);
			setPrivacySetting(savedData.privacySetting || 'public');
		}
	}, []);

	// Сохранение данных в localStorage
	const saveSettings = () => {
		const settings = {
			name,
			email,
			avatar,
			isDarkMode,
			notificationsEnabled,
			privacySetting,
		};
		localStorage.setItem('userSettings', JSON.stringify(settings));
		toast.success('Настройки успешно сохранены!', {
			position: 'top-right',
			autoClose: 3000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
		});
	};

	// Обработчики изменений
	const handleNameChange = (e) => setName(e.target.value);
	const handleEmailChange = (e) => setEmail(e.target.value);
	const handleAvatarChange = (e) =>
		setAvatar(URL.createObjectURL(e.target.files[0]));
	const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
	const toggleNotifications = () => setNotificationsEnabled((prev) => !prev);
	const handlePrivacyChange = (e) =>
		setPrivacySetting(e.target.checked ? 'private' : 'public');

	return (
		<Box
			component={motion.div}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5 }}
			sx={{
				p: 4,
				maxWidth: '100%',
				margin: 'auto',
				background: isDarkMode ? '#121212' : '#fff',
				color: isDarkMode ? '#fff' : '#000',
				minHeight: '100vh',
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			{/* Уведомления */}
			<ToastContainer />

			{/* Эффект звезд для тёмной темы */}
			<AnimatePresence>
				{isDarkMode && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 1 }}
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: '100%',
							pointerEvents: 'none',
							zIndex: -1,
						}}
					>
						{[...Array(100)].map((_, index) => (
							<motion.span
								key={index}
								style={{
									position: 'absolute',
									top: `${Math.random() * 100}%`,
									left: `${Math.random() * 100}%`,
									width: `${Math.random() * 2}px`,
									height: `${Math.random() * 2}px`,
									background: 'white',
									borderRadius: '50%',
									animation: `twinkle ${
										Math.random() * 3 + 2
									}s infinite alternate`,
								}}
							/>
						))}
					</motion.div>
				)}
			</AnimatePresence>

			{/* Заголовок */}
			<Typography variant='h5' gutterBottom align='center'>
				Настройки
			</Typography>

			{/* Основной контейнер с Grid */}
			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, // Адаптивная сетка
					gap: 4,
				}}
			>
				{/* Блок основных настроек */}
				<Box>
					<Typography variant='h6' gutterBottom>
						Основные настройки
					</Typography>
					<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
						<label htmlFor='avatar-upload'>
							<IconButton component='span' sx={{ position: 'relative' }}>
								<Avatar
									src={avatar}
									alt='User Avatar'
									sx={{ width: 80, height: 80, cursor: 'pointer' }}
								/>
								<PhotoCamera
									sx={{
										position: 'absolute',
										bottom: 0,
										right: 0,
										color: 'primary.main',
									}}
								/>
							</IconButton>
						</label>
						<input
							id='avatar-upload'
							type='file'
							accept='image/*'
							style={{ display: 'none' }}
							onChange={handleAvatarChange}
						/>
					</Box>
					<TextField
						label='Имя'
						fullWidth
						value={name}
						onChange={handleNameChange}
						sx={{ mb: 2 }}
					/>
					<TextField
						label='Email'
						fullWidth
						value={email}
						onChange={handleEmailChange}
					/>
				</Box>

				{/* Блок дополнительных настроек */}
				<Box>
					{/* Переключение темы */}
					<Typography variant='h6' gutterBottom>
						Тема
					</Typography>
					<FormControlLabel
						control={
							<Switch
								checked={isDarkMode}
								onChange={toggleDarkMode}
								sx={{
									'& .MuiSwitch-thumb': {
										backgroundColor: isDarkMode ? '#fff' : '#000',
										transition: 'transform 0.3s ease-in-out',
										transform: isDarkMode
											? 'translateX(20px)'
											: 'translateX(0)',
									},
									'& .MuiSwitch-track': {
										backgroundColor: isDarkMode ? '#2196f3' : '#ccc',
									},
								}}
							/>
						}
						label={isDarkMode ? 'Тёмная тема' : 'Светлая тема'}
					/>

					<Divider sx={{ my: 3 }} />

					{/* Управление уведомлениями */}
					<Typography variant='h6' gutterBottom>
						Уведомления
					</Typography>
					<FormControlLabel
						control={
							<Switch
								checked={notificationsEnabled}
								onChange={toggleNotifications}
							/>
						}
						label={notificationsEnabled ? 'Включены' : 'Выключены'}
					/>

					<Divider sx={{ my: 3 }} />

					{/* Настройки приватности */}
					<Typography variant='h6' gutterBottom>
						Приватность
					</Typography>
					<FormControlLabel
						control={
							<Switch
								checked={privacySetting === 'private'}
								onChange={handlePrivacyChange}
							/>
						}
						label={
							privacySetting === 'private'
								? 'Приватный профиль'
								: 'Публичный профиль'
						}
					/>
				</Box>
			</Box>

			{/* Кнопка сохранения */}
			<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
				<Button
					variant='contained'
					color='primary'
					onClick={saveSettings}
					sx={{
						background: isDarkMode ? '#2196f3' : '#1976d2',
						'&:hover': {
							background: isDarkMode ? '#1e88e5' : '#115293',
						},
					}}
				>
					Сохранить настройки
				</Button>
			</Box>
		</Box>
	);
};

export default Settings;
