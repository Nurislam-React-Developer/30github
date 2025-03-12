import { Box, Typography, Button } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ForestBackGround from '../../public/forestBackgorund.png';
import MounthainBackground from '../../public/mounthBackground.png';
import OceanBackground from '../../public/oceanBackground.png';
import DefaultBackground from '../../public/redPhone.png';
import SunsentBackGround from '../../public/sunsetBackground.png';
import UserSettings from '../components/settings/UserSettings';
import VisualSettings from '../components/settings/VisualSettings';
import AccountSettings from '../components/settings/AccountSettings';

// Звуковые файлы (предполагается, что они есть в проекте)
import SaveSound from '../../public/sounds/SaveSound.mp3'; // Добавь свой звук
import ResetSound from '../../public/sounds/ResetSound.mp3'; // Добавь свой звук

const Settings = () => {
	const navigate = useNavigate();
	const { darkMode } = useTheme();
	const [isLoading, setIsLoading] = useState(false);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [accentColor, setAccentColor] = useState('#2196f3');
	const [backgroundMedia, setBackgroundMedia] = useState(DefaultBackground);
	const [backgroundTheme, setBackgroundTheme] = useState('default');
	const [tilt, setTilt] = useState({ x: 0, y: 0 });

	// Динамическая цветовая палитра
	const colorPalette = useMemo(
		() => ['#2196f3', '#ff6f61', '#6b48ff', '#00c4cc', '#ffca28'],
		[]
	);
	const [colorIndex, setColorIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setColorIndex((prev) => (prev + 1) % colorPalette.length);
			setAccentColor(colorPalette[colorIndex]);
		}, 3000); // Меняем цвет каждые 3 секунды
		return () => clearInterval(interval);
	}, [colorPalette, colorIndex]);

	// Темы фона
	const backgroundThemes = useMemo(
		() => [
			{ value: 'default', name: 'Стандарт', image: DefaultBackground },
			{ value: 'forest', name: 'Лес', image: ForestBackGround },
			{ value: 'ocean', name: 'Океан', image: OceanBackground },
			{ value: 'sunset', name: 'Закат', image: SunsentBackGround },
			{ value: 'mountain', name: 'Горы', image: MounthainBackground },
		],
		[]
	);

	// Обработчик изменения фона
	const handleBackgroundThemeChange = useCallback(
		(value) => {
			setBackgroundTheme(value);
			const selectedTheme = backgroundThemes.find(
				(theme) => theme.value === value
			);
			setBackgroundMedia(selectedTheme?.image || DefaultBackground);
		},
		[backgroundThemes]
	);

	// Загрузка данных
	useEffect(() => {
		const savedData = JSON.parse(localStorage.getItem('userSettings')) || {};
		setName(savedData.name || '');
		setEmail(savedData.email || '');
		setAccentColor(savedData.accentColor || '#2196f3');
		setBackgroundTheme(savedData.backgroundTheme || 'default');
		setBackgroundMedia(savedData.backgroundMedia || DefaultBackground);
	}, []);

	// Звуковые эффекты
	const playSound = (sound) => {
		const audio = new Audio(sound);
		audio.play().catch((err) => console.log('Audio error:', err));
	};

	// Сохранение настроек
	const saveSettings = useCallback(() => {
		const settings = {
			name,
			email,
			accentColor,
			backgroundMedia,
			backgroundTheme,
		};
		localStorage.setItem('userSettings', JSON.stringify(settings));
		playSound(SaveSound);
		toast.success('Сохранено!', {
			position: 'bottom-center',
			autoClose: 1500,
			hideProgressBar: true,
			style: { background: darkMode ? '#444' : '#fff', borderRadius: '12px' },
		});
	}, [name, email, accentColor, backgroundMedia, backgroundTheme, darkMode]);

	// Сброс настроек
	const resetSettings = useCallback(() => {
		setName('');
		setEmail('');
		setAccentColor('#2196f3');
		setBackgroundTheme('default');
		setBackgroundMedia(DefaultBackground);
		localStorage.removeItem('userSettings');
		playSound(ResetSound);
		toast.info('Сброшено!', { position: 'bottom-center', autoClose: 1500 });
	}, []);

	// 3D-эффект фона
	const handleMouseMove = (e) => {
		const { clientX, clientY, currentTarget } = e;
		const { width, height, left, top } = currentTarget.getBoundingClientRect();
		const x = ((clientX - left) / width - 0.5) * 20;
		const y = ((clientY - top) / height - 0.5) * -20;
		setTilt({ x, y });
	};

	const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

	return (
		<Box
			sx={{
				minHeight: '100vh',
				background: darkMode
					? 'linear-gradient(135deg, #1a1a1a, #2c3e50)' // Градиент вместо белого
					: 'linear-gradient(135deg, #f5f7fa, #dfe6e9)',
				padding: { xs: 2, sm: 4 },
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			{/* Фон с 3D-эффектом */}
			<Box
				component='img'
				src={backgroundMedia}
				alt='Background'
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
				sx={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					objectFit: 'cover',
					opacity: darkMode ? 0.15 : 0.25,
					filter: 'blur(8px) brightness(0.9)',
					transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
					transition: 'transform 0.3s ease, opacity 0.5s ease',
					zIndex: 0,
				}}
			/>

			{/* Контейнер настроек */}
			<Box
				sx={{
					position: 'relative',
					zIndex: 1,
					maxWidth: 800,
					margin: '0 auto',
					background: darkMode
						? 'rgba(40, 40, 40, 0.9)'
						: 'rgba(255, 255, 255, 0.9)',
					borderRadius: '20px',
					padding: { xs: 3, sm: 4 },
					boxShadow: '0 15px 40px rgba(0, 0, 0, 0.1)',
					backdropFilter: 'blur(12px)',
				}}
			>
				<ToastContainer />

				<Typography
					variant='h5'
					align='center'
					sx={{
						fontWeight: 700,
						color: darkMode ? '#fff' : '#2c3e50',
						mb: 3,
						textTransform: 'uppercase',
						letterSpacing: '1px',
					}}
				>
					Настройки
				</Typography>

				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
					<UserSettings
						name={name}
						setName={setName}
						email={email}
						setEmail={setEmail}
					/>
					<VisualSettings
						accentColor={accentColor}
						setAccentColor={setAccentColor}
						backgroundTheme={backgroundTheme}
						handleBackgroundThemeChange={handleBackgroundThemeChange}
						backgroundThemes={backgroundThemes}
					/>
					<AccountSettings
						isLoading={isLoading}
						handleLogout={async () => {
							setIsLoading(true);
							try {
								localStorage.clear();
								toast.success('Выход выполнен!', { position: 'bottom-center' });
								navigate('/signin');
							} catch (error) {
								toast.error('Ошибка выхода', { position: 'bottom-center' });
							} finally {
								setIsLoading(false);
							}
						}}
					/>
				</Box>

				{/* Кнопки с пульсом */}
				<Box
					sx={{
						display: 'flex',
						gap: 2,
						mt: 4,
						justifyContent: 'center',
						position: 'relative',
					}}
				>
					<Box
						sx={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							width: '120%',
							height: '120%',
							background: `radial-gradient(circle, ${accentColor}20 0%, transparent 70%)`,
							transform: 'translate(-50%, -50%)',
							animation: 'pulse 2s infinite',
							zIndex: -1,
							borderRadius: '50%',
						}}
					/>
					<Button
						onClick={saveSettings}
						sx={{
							flex: 1,
							padding: '12px 20px',
							borderRadius: '12px',
							background: `linear-gradient(135deg, ${accentColor}, ${accentColor}80)`,
							color: '#fff',
							fontWeight: 600,
							textTransform: 'none',
							boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
							transition:
								'transform 0.2s ease, box-shadow 0.2s ease, background 0.5s ease',
							position: 'relative',
							zIndex: 1,
							'&:hover': {
								transform: 'translateY(-2px)',
								boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
								background: `linear-gradient(135deg, ${accentColor}cc, ${accentColor})`,
							},
						}}
					>
						Сохранить
					</Button>
					<Button
						onClick={resetSettings}
						sx={{
							flex: 1,
							padding: '12px 20px',
							borderRadius: '12px',
							background: darkMode ? '#555' : '#ecf0f1',
							color: darkMode ? '#fff' : '#7f8c8d',
							fontWeight: 600,
							textTransform: 'none',
							boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
							transition: 'transform 0.2s ease, box-shadow 0.2s ease',
							position: 'relative',
							zIndex: 1,
							'&:hover': {
								transform: 'translateY(-2px)',
								boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
								background: darkMode ? '#666' : '#dfe6e9',
							},
						}}
					>
						Сбросить
					</Button>
				</Box>

				{/* Прогресс */}
				<Box
					sx={{
						mt: 2,
						height: '4px',
						background: darkMode ? '#444' : '#e0e0e0',
						borderRadius: '2px',
						overflow: 'hidden',
					}}
				>
					<Box
						sx={{
							width: `${Math.min((name.length + email.length) * 5, 100)}%`,
							height: '100%',
							background: accentColor,
							transition: 'width 0.3s ease, background 0.5s ease',
						}}
					/>
				</Box>
			</Box>

			{/* Анимация пульса */}
			<style>
				{`
          @keyframes pulse {
            0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(1.2); opacity: 0; }
          }
        `}
			</style>
		</Box>
	);
};

export default Settings;
