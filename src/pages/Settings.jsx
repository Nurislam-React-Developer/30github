import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Particles } from 'react-particles'; // Обновленный импорт
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loadFull } from 'tsparticles'; // Обновленный импорт
import ForestBackGround from '../../public/forestBackgorund.png';
import MounthainBackground from '../../public/mountainsBackground.png';
import OceanBackground from '../../public/oceanBackground.png';
import DefaultBackground from '../../public/redPhone.png';
import SunsentBackGround from '../../public/sunsetBackground.png';

const Settings = () => {
	// Состояния для полей формы
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [avatar, setAvatar] = useState(localStorage.getItem('userAvatar') || null);
	const [notificationsEnabled, setNotificationsEnabled] = useState(true);
	const [privacySetting, setPrivacySetting] = useState('public');
	const [accentColor, setAccentColor] = useState('#2196f3');
	const [particlesEnabled, setParticlesEnabled] = useState(false);
	const [particlesCount, setParticlesCount] = useState(80);
	const [backgroundMedia, setBackgroundMedia] = useState(null);
	const [backgroundType, setBackgroundType] = useState('none'); // 'none', 'image', or 'video'
	const [backgroundTheme, setBackgroundTheme] = useState('default');

	// Set default background on initial load
	useEffect(() => {
		if (!backgroundMedia) {
			setBackgroundMedia(DefaultBackground);
			setBackgroundType('image');
		}
	}, [backgroundMedia]);

	// Предустановленные темы фона с изображениями
	const backgroundThemes = useMemo(
		() => [
			{ value: 'default', name: 'По умолчанию', image: DefaultBackground },
			{ value: 'forest', name: 'Лесная', image: ForestBackGround },
			{ value: 'ocean', name: 'Океан', image: OceanBackground },
			{ value: 'sunset', name: 'Закат', image: SunsentBackGround },
			{ value: 'mountain', name: 'Горы', image: MounthainBackground },
		],
		[]
	);

	// Обработчик изменения темы фона
	const handleBackgroundThemeChange = useCallback(
		(value) => {
			setBackgroundTheme(value);
			const selectedTheme = backgroundThemes.find(
				(theme) => theme.value === value
			);
			if (selectedTheme) {
				setBackgroundMedia(selectedTheme.image);
				setBackgroundType('image');
			} else {
				setBackgroundMedia(null);
				setBackgroundType('none');
			}
		},
		[backgroundThemes]
	);

	// Предустановленные цветовые схемы
	const colorSchemes = useMemo(
		() => [
			{ name: 'Закат', colors: ['#ff9a9e', '#fad0c4'] },
			{ name: 'Океан', colors: ['#4facfe', '#00f2fe'] },
			{ name: 'Лес', colors: ['#43e97b', '#38f9d7'] },
			{ name: 'Лаванда', colors: ['#a18cd1', '#fbc2eb'] },
		],
		[]
	);

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
			setParticlesEnabled(savedData.particlesEnabled || false);
			setBackgroundMedia(savedData.backgroundMedia || null);
			setBackgroundType(savedData.backgroundType || 'none');
			setBackgroundTheme(savedData.backgroundTheme || 'default');
			
			// Применяем тему фона при загрузке
			if (savedData.backgroundTheme) {
				const selectedTheme = backgroundThemes.find(
					(theme) => theme.value === savedData.backgroundTheme
				);
				if (selectedTheme && selectedTheme.image) {
					setBackgroundMedia(selectedTheme.image);
					setBackgroundType('image');
				}
			}
		}
	}, [backgroundThemes]);

	// Сохранение данных в localStorage
	const saveSettings = useCallback(() => {
		const settings = {
			name,
			email,
			avatar,
			notificationsEnabled,
			privacySetting,
			accentColor,
			particlesEnabled,
			backgroundMedia,
			backgroundType,
			backgroundTheme,
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
	}, [
		name,
		email,
		avatar,
		notificationsEnabled,
		privacySetting,
		accentColor,
		particlesEnabled,
		backgroundMedia,
		backgroundType,
		backgroundTheme,
	]);

	// Обработчик загрузки фона
	const handleBackgroundChange = useCallback((e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setBackgroundMedia(reader.result);
				setBackgroundType(file.type.startsWith('image/') ? 'image' : 'video');
			};
			reader.readAsDataURL(file);
		}
	}, []);

	// Преобразование файла в base64
	const handleAvatarChange = useCallback((e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				const base64String = reader.result;
				setAvatar(base64String);
				localStorage.setItem('userAvatar', base64String);
			};
			reader.readAsDataURL(file);
		}
	}, []);

	// Настройка частиц
	const particlesInit = useCallback(async (main) => {
		await loadFull(main);
	});

	return (
		<>
			<Box
				component='main'
				sx={{
					background: '#f5f5f5',
					minHeight: '100vh',
					position: 'relative',
					overflow: 'hidden',
					padding: 4,
				}}
			>
				{backgroundMedia && (
					<Box
						component={backgroundType === 'video' ? 'video' : 'img'}
						src={backgroundMedia}
						autoPlay={backgroundType === 'video'}
						loop={backgroundType === 'video'}
						muted={backgroundType === 'video'}
						playsInline={backgroundType === 'video'}
						alt='Background'
						sx={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							width: '100%',
							height: '840px',
							objectFit: 'cover',
							zIndex: 0,
							opacity: 1,
							overflow: 'hidden',
							boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)'
						}}
					/>
				)}

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
									value: particlesCount,
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

				<Box
					component='section'
					sx={{
						backgroundColor: 'rgba(255, 255, 255, 0.9)',
						borderRadius: 4,
						padding: 4,
						margin: 'auto',
						maxWidth: 1200,
						boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
						position: 'relative',
						zIndex: 1
					}}
				>
					<ToastContainer />

					<Typography variant='h4' gutterBottom align='center' sx={{ mb: 4 }}>
						Настройки
					</Typography>

					<Box
						component='div'
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
							<Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
								<Typography variant='h6' gutterBottom>
									Аватар
								</Typography>
								{avatar && (
									<Box
										component='img'
										src={avatar}
										alt='Avatar'
										sx={{
											width: 100,
											height: 100,
											borderRadius: '50%',
											mb: 2,
											objectFit: 'cover',
											border: '2px solid #3f51b5'
										}}
									/>
								)}
								<Button
									variant='contained'
									component='label'
									size='small'
								>
									{avatar ? 'Изменить аватар' : 'Загрузить аватар'}
									<input
										type='file'
										hidden
										onChange={handleAvatarChange}
										accept='image/*'
									/>
								</Button>
							</Box>
							<TextField
								label='Имя'
								fullWidth
								value={name}
								onChange={(e) => setName(e.target.value)}
								sx={{ mb: 2 }}
							/>
							<TextField
								label='Электронная почта'
								fullWidth
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								sx={{ mb: 2 }}
							/>
							<Typography variant='h6' gutterBottom sx={{ mt: 2 }}>
								Количество частиц: {particlesCount}
							</Typography>
						</Box>

						{/* Блок дополнительных настроек */}
						<Box>
							<Typography variant='h6' gutterBottom>
								Визуальные настройки
							</Typography>
							<FormControl fullWidth sx={{ mb: 2 }}>
								<InputLabel>Цвет акцента</InputLabel>
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

							<FormControlLabel
								control={
									<Switch
										checked={particlesEnabled}
										onChange={() => setParticlesEnabled((prev) => !prev)}
									/>
								}
								label={
									particlesEnabled ? 'Анимация включена' : 'Анимация выключена'
								}
								sx={{ mb: 2 }}
							/>

							<FormControl fullWidth sx={{ mb: 2 }}>
								<InputLabel>Тема фона</InputLabel>
								<Select
									value={backgroundTheme}
									onChange={(e) => handleBackgroundThemeChange(e.target.value)}
									fullWidth
								>
									{backgroundThemes.map((theme) => (
										<MenuItem key={theme.value} value={theme.value}>
											{theme.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<Button
								variant='contained'
								component='label'
								fullWidth
								sx={{ mb: 1 }}
							>
								Загрузить свой фон
								<input
									type='file'
									hidden
									onChange={handleBackgroundChange}
									accept='image/*,video/*'
								/>
							</Button>

							<Button
								variant='contained'
								color='primary'
								onClick={saveSettings}
								sx={{
									background: accentColor,
									'&:hover': {
										background: `${accentColor}cc`,
									},
									flex: 1,
								}}
							>
								Сохранить настройки
							</Button>
							<Button
								variant='outlined'
								color='error'
								onClick={() => {
									setName('');
									setEmail('');
									setAvatar(null);
									setNotificationsEnabled(true);
									setPrivacySetting('public');
									setAccentColor('#2196f3');
									setParticlesEnabled(false);
									setParticlesCount(80);
									setGradientColors(['#ff9a9e', '#fad0c4']);
									localStorage.removeItem('userSettings');
									toast.info('Настройки сброшены к значениям по умолчанию');
								}}
								sx={{ flex: 1 }}
							>
								Сбросить настройки
							</Button>
						</Box>
					</Box>
				</Box>
			</Box>
		</>
	);
};

export default Settings;
