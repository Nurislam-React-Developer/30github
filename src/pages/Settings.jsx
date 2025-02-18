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
	Slider,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Settings = () => {
	// Состояния для полей формы
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [avatar, setAvatar] = useState(null); // Base64 строка
	const [notificationsEnabled, setNotificationsEnabled] = useState(true);
	const [privacySetting, setPrivacySetting] = useState('public');
	const [accentColor, setAccentColor] = useState('#2196f3'); // Цвет акцента
	const [pageTransitionAnimation, setPageTransitionAnimation] = useState(true); // Анимация перехода
	const [language, setLanguage] = useState('ru'); // Язык интерфейса
	const [animationSpeed, setAnimationSpeed] = useState(500); // Скорость анимации

	// Загрузка данных из localStorage при монтировании
	useEffect(() => {
		const savedData = JSON.parse(localStorage.getItem('userSettings'));
		if (savedData) {
			setName(savedData.name || '');
			setEmail(savedData.email || '');
			setAvatar(savedData.avatar || null); // Восстанавливаем аватар
			setNotificationsEnabled(savedData.notificationsEnabled || true);
			setPrivacySetting(savedData.privacySetting || 'public');
			setAccentColor(savedData.accentColor || '#2196f3');
			setPageTransitionAnimation(savedData.pageTransitionAnimation || true);
			setLanguage(savedData.language || 'ru');
			setAnimationSpeed(savedData.animationSpeed || 500);
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
			pageTransitionAnimation,
			language,
			animationSpeed,
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

	// Преобразование файла в base64
	const handleAvatarChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setAvatar(reader.result); // Сохраняем base64 строку
			};
			reader.readAsDataURL(file); // Преобразуем файл в base64
		}
	};

	// Обработчики изменений
	const handleNameChange = (e) => setName(e.target.value);
	const handleEmailChange = (e) => setEmail(e.target.value);
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
					<Divider sx={{ my: 3 }} />

					{/* Анимация перехода между страницами */}
					<Typography variant='h6' gutterBottom>
						Анимация перехода
					</Typography>
					<FormControlLabel
						control={
							<Switch
								checked={pageTransitionAnimation}
								onChange={() => setPageTransitionAnimation((prev) => !prev)}
							/>
						}
						label={pageTransitionAnimation ? 'Включена' : 'Выключена'}
					/>
					<Divider sx={{ my: 3 }} />

					{/* Выбор языка интерфейса */}
					<Typography variant='h6' gutterBottom>
						Язык интерфейса
					</Typography>
					<Select
						value={language}
						onChange={(e) => setLanguage(e.target.value)}
						fullWidth
						sx={{ mb: 2 }}
					>
						<MenuItem value='ru'>Русский</MenuItem>
						<MenuItem value='en'>English</MenuItem>
					</Select>

					{/* Скорость анимации */}
					<Typography variant='h6' gutterBottom>
						Скорость анимации ({animationSpeed} мс)
					</Typography>
					<Slider
						value={animationSpeed}
						onChange={(e, newValue) => setAnimationSpeed(newValue)}
						min={100}
						max={1000}
						step={50}
						marks={[
							{ value: 100, label: 'Быстро' },
							{ value: 1000, label: 'Медленно' },
						]}
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
