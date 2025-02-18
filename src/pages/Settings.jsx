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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Settings = () => {
	// Состояния для полей формы
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [avatar, setAvatar] = useState(null);
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
	const toggleNotifications = () => setNotificationsEnabled((prev) => !prev);
	const handlePrivacyChange = (e) =>
		setPrivacySetting(e.target.checked ? 'private' : 'public');

	return (
		<Box
			sx={{
				p: 4,
				maxWidth: '100%',
				margin: 'auto',
				background: '#fff',
				color: '#000',
				minHeight: '100vh',
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			{/* Уведомления */}
			<ToastContainer />

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
