import React, { useState } from 'react';
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

const Settings = () => {
	// Состояния для полей формы
	const [name, setName] = useState('John Doe');
	const [email, setEmail] = useState('johndoe@example.com');
	const [avatar, setAvatar] = useState(null);
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [notificationsEnabled, setNotificationsEnabled] = useState(true);
	const [privacySetting, setPrivacySetting] = useState('public');

	// Обработчики изменений
	const handleNameChange = (e) => setName(e.target.value);
	const handleEmailChange = (e) => setEmail(e.target.value);
	const handleAvatarChange = (e) =>
		setAvatar(URL.createObjectURL(e.target.files[0]));
	const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
	const toggleNotifications = () => setNotificationsEnabled((prev) => !prev);
	const handlePrivacyChange = (e) => setPrivacySetting(e.target.value);

	return (
		<Box sx={{ p: 4, maxWidth: 600, margin: 'auto' }}>
			{/* Заголовок */}
			<Typography variant='h5' gutterBottom>
				Настройки
			</Typography>

			{/* Основные настройки пользователя */}
			<Box sx={{ mb: 3 }}>
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

			<Divider sx={{ my: 3 }} />

			{/* Переключение темы */}
			<Box sx={{ mb: 3 }}>
				<Typography variant='h6' gutterBottom>
					Тема
				</Typography>
				<FormControlLabel
					control={<Switch checked={isDarkMode} onChange={toggleDarkMode} />}
					label={isDarkMode ? 'Тёмная тема' : 'Светлая тема'}
				/>
			</Box>

			<Divider sx={{ my: 3 }} />

			{/* Управление уведомлениями */}
			<Box sx={{ mb: 3 }}>
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
			</Box>

			<Divider sx={{ my: 3 }} />

			{/* Настройки приватности */}
			<Box>
				<Typography variant='h6' gutterBottom>
					Приватность
				</Typography>
				<FormControlLabel
					control={
						<Switch
							checked={privacySetting === 'private'}
							onChange={(e) =>
								handlePrivacyChange({
									target: { value: e.target.checked ? 'private' : 'public' },
								})
							}
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
	);
};

export default Settings;
