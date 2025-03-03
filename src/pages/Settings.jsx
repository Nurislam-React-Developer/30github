import {
  Box,
  Typography,
} from '@mui/material';
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

const Settings = () => {
	const navigate = useNavigate();
	const { darkMode } = useTheme();
	const [isLoading, setIsLoading] = useState(false);
	// Состояния для полей формы
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [notificationsEnabled, setNotificationsEnabled] = useState(true);
	const [privacySetting, setPrivacySetting] = useState('public');
	const [accentColor, setAccentColor] = useState('#2196f3');

	const [backgroundMedia, setBackgroundMedia] = useState(null);
	const [backgroundType, setBackgroundType] = useState('none');
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
		// Load user settings
		const savedData = JSON.parse(localStorage.getItem('userSettings'));
		// Load profile data
		const profileName = localStorage.getItem('profileName');
		const profileEmail = localStorage.getItem('profileUsername');

		// Set data with priority to profile data
		setName(profileName || (savedData?.name || ''));
		setEmail(profileEmail || (savedData?.email || ''));
		setNotificationsEnabled(savedData?.notificationsEnabled || true);
		setPrivacySetting(savedData?.privacySetting || 'public');
		setAccentColor(savedData?.accentColor || '#2196f3');

		setBackgroundMedia(savedData?.backgroundMedia || null);
		setBackgroundType(savedData?.backgroundType || 'none');
		setBackgroundTheme(savedData?.backgroundTheme || 'default');
			
		// Применяем тему фона при загрузке
		if (savedData?.backgroundTheme) {
			const selectedTheme = backgroundThemes.find(
				(theme) => theme.value === savedData.backgroundTheme
			);
			if (selectedTheme && selectedTheme.image) {
				setBackgroundMedia(selectedTheme.image);
				setBackgroundType('image');
			}
		}
	}, [backgroundThemes]);

	// Сохранение данных в localStorage
	const saveSettings = useCallback(() => {
		const settings = {
			name,
			email,
			notificationsEnabled,
			privacySetting,
			accentColor,
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
		notificationsEnabled,
		privacySetting,
		accentColor,
		backgroundMedia,
		backgroundType,
		backgroundTheme,
	]);

	return (
		<>
			<Box
				component='main'
				sx={{
					background: '#f5f5f5',
					minHeight: '100vh',
					position: 'relative',
					overflow: 'hidden',
					padding: { xs: 2, sm: 4 },
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

				<Box
					component='section'
					sx={{
						backgroundColor: 'rgba(255, 255, 255, 0.9)',
						borderRadius: 4,
						padding: { xs: 2, sm: 4 },
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
						<UserSettings
							name={name}
							setName={setName}
							email={email}
							setEmail={setEmail}
						/>

						<Box>
							<VisualSettings
								accentColor={accentColor}
								setAccentColor={setAccentColor}
								backgroundTheme={backgroundTheme}
								handleBackgroundThemeChange={handleBackgroundThemeChange}
								backgroundThemes={backgroundThemes}
								saveSettings={saveSettings}
								resetSettings={() => {
									setName('');
									setEmail('');
									setNotificationsEnabled(true);
									setPrivacySetting('public');
									setAccentColor('#2196f3');

									localStorage.removeItem('userSettings');
									toast.info('Настройки сброшены к значениям по умолчанию');
								}}
							/>

							<AccountSettings
								isLoading={isLoading}
								handleLogout={async () => {
									setIsLoading(true);
									try {
										localStorage.removeItem('token');
										localStorage.removeItem('user');
										localStorage.removeItem('userSettings');

										toast.success('Вы успешно вышли из аккаунта!', {
											position: 'top-right',
											autoClose: 2000,
											hideProgressBar: false,
											closeOnClick: true,
											pauseOnHover: true,
											draggable: true,
											theme: darkMode ? 'dark' : 'light'
										});

										navigate('/signin');
									} catch (error) {
										console.error('Error during logout:', error);
										toast.error('Произошла ошибка при выходе из аккаунта', {
											position: 'top-right',
											autoClose: 3000,
											hideProgressBar: false,
											closeOnClick: true,
											pauseOnHover: true,
											draggable: true,
											theme: darkMode ? 'dark' : 'light'
										});
									} finally {
										setIsLoading(false);
									}
								}}
							/>
						</Box>
					</Box>
				</Box>
			</Box>
		</>
	);
};

export default Settings;
