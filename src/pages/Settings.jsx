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
	InputLabel,
	FormControl,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Particles } from '@tsparticles/react'; // Обновленный импорт
import { loadFull } from 'tsparticles'; // Обновленный импорт

const Settings = () => {
	// Состояния для полей формы
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [avatar, setAvatar] = useState(null); // Base64 строка
	const [notificationsEnabled, setNotificationsEnabled] = useState(true);
	const [privacySetting, setPrivacySetting] = useState('public');
	const [accentColor, setAccentColor] = useState('#2196f3'); // Цвет акцента
	const [particlesEnabled, setParticlesEnabled] = useState(false); // Анимация частиц
	const [gradientColors, setGradientColors] = useState(['#ff9a9e', '#fad0c4']); // Цвета градиента

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
			setParticlesEnabled(savedData.particlesEnabled || false);
			setGradientColors(savedData.gradientColors || ['#ff9a9e', '#fad0c4']);
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
			particlesEnabled,
			gradientColors,
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

	// Настройка частиц
	const particlesInit = async (main) => {
		await loadFull(main);
	};

	return (
		<Box
			sx={{
				p: 4,
				maxWidth: '100%',
				margin: 'auto',
				background: `linear-gradient(135deg, ${gradientColors[0]}, ${gradientColors[1]})`,
				color: '#000',
				minHeight: '100vh',
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			{/* Частицы */}
			{particlesEnabled && (
				<Particles
					id='tsparticles'
					init={particlesInit}
					options={{
						background: {
							color: {
								value: 'transparent',
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
								value: accentColor,
							},
							links: {
								color: accentColor,
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

			{/* Уведомления */}
			<ToastContainer />

			{/* Основной контент */}
			<Typography variant='h5' gutterBottom align='center'>
				Настройки
			</Typography>

			{/* Основной контейнер с Grid */}
			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
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
						onChange={(e) => setName(e.target.value)}
						sx={{ mb: 2 }}
					/>
					<TextField
						label='Email'
						fullWidth
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</Box>

				{/* Блок дополнительных настроек */}
				<Box>
					{/* Выбор цвета акцента */}
					<Typography variant='h6' gutterBottom>
						Цвет акцента
					</Typography>
					<FormControl fullWidth sx={{ mb: 2 }}>
						<InputLabel>Цвет</InputLabel>
						<Select
							value={accentColor}
							onChange={(e) => setAccentColor(e.target.value)}
							fullWidth
						>
							<MenuItem value='#2196f3'>Синий</MenuItem>
							<MenuItem value='#4caf50'>Зелёный</MenuItem>
							<MenuItem value='#ff9800'>Оранжевый</MenuItem>
							<MenuItem value='#e91e63'>Розовый</MenuItem>
						</Select>
					</FormControl>

					{/* Анимация частиц */}
					<Typography variant='h6' gutterBottom>
						Анимация частиц
					</Typography>
					<FormControlLabel
						control={
							<Switch
								checked={particlesEnabled}
								onChange={() => setParticlesEnabled((prev) => !prev)}
							/>
						}
						label={particlesEnabled ? 'Включена' : 'Выключена'}
					/>
					<Divider sx={{ my: 3 }} />

					{/* Градиентный фон */}
					<Typography variant='h6' gutterBottom>
						Градиентный фон
					</Typography>
					<Box sx={{ display: 'flex', gap: 2 }}>
						<TextField
							label='Цвет 1'
							fullWidth
							value={gradientColors[0]}
							onChange={(e) =>
								setGradientColors([e.target.value, gradientColors[1]])
							}
							sx={{ mb: 2 }}
						/>
						<TextField
							label='Цвет 2'
							fullWidth
							value={gradientColors[1]}
							onChange={(e) =>
								setGradientColors([gradientColors[0], e.target.value])
							}
							sx={{ mb: 2 }}
						/>
					</Box>
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
