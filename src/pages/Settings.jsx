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
	Select,
	MenuItem,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loadFull } from 'tsparticles';

const Settings = () => {
	// Состояния для полей формы
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [avatar, setAvatar] = useState(null);
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [notificationsEnabled, setNotificationsEnabled] = useState(true);
	const [privacySetting, setPrivacySetting] = useState('public');
	const [accentColor, setAccentColor] = useState('#2196f3'); // Цвет акцента

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
			setAccentColor(savedData.accentColor || '#2196f3');
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
			accentColor,
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

	// Настройка частиц
	const particlesInit = async (main) => {
		await loadFull(main);
	};

	const particlesLoaded = () => {
		console.log('Particles loaded!');
	};

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

			{/* Частицы для тёмной темы */}
			{isDarkMode && (
				<Particles
					id='tsparticles'
					init={particlesInit}
					loaded={particlesLoaded}
					options={{
						background: {
							color: {
								value: '#121212',
							},
						},
						fpsLimit: 60,
						interactivity: {
							events: {
								onClick: {
									enable: true,
									mode: 'push',
								},
								onHover: {
									enable: true,
									mode: 'repulse',
								},
							},
							modes: {
								push: {
									quantity: 4,
								},
								repulse: {
									distance: 100,
									duration: 0.4,
								},
							},
						},
						particles: {
							color: {
								value: '#ffffff',
							},
							links: {
								color: '#ffffff',
								distance: 150,
								enable: true,
								opacity: 0.5,
								width: 1,
							},
							collisions: {
								enable: true,
							},
							move: {
								direction: 'none',
								enable: true,
								outModes: {
									default: 'bounce',
								},
								random: false,
								speed: 2,
								straight: false,
							},
							number: {
								density: {
									enable: true,
									area: 800,
								},
								value: 80,
							},
							opacity: {
								value: 0.5,
							},
							shape: {
								type: 'circle',
							},
							size: {
								value: { min: 1, max: 5 },
							},
						},
						detectRetina: true,
					}}
				/>
			)}

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

					{/* Выбор цвета акцента */}
					<Typography variant='h6' gutterBottom>
						Цвет акцента
					</Typography>
					<Select
						value={accentColor}
						onChange={(e) => setAccentColor(e.target.value)}
						fullWidth
						sx={{ mb: 2 }}
					>
						<MenuItem value='#2196f3'>Синий</MenuItem>
						<MenuItem value='#4caf50'>Зелёный</MenuItem>
						<MenuItem value='#ff9800'>Оранжевый</MenuItem>
						<MenuItem value='#e91e63'>Розовый</MenuItem>
					</Select>

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
						background: accentColor,
						'&:hover': {
							background: `${accentColor}cc`, // Полупрозрачный при наведении
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
