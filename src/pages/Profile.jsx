import React, { useState } from 'react';
import {
	Avatar,
	Button,
	TextField,
	Typography,
	Box,
	styled,
} from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // Для навигации

const Profile = () => {
	const navigate = useNavigate(); // Инициализация навигации
	const [name, setName] = useState(
		localStorage.getItem('profileName') || 'Default Name'
	);
	const [avatar, setAvatar] = useState(
		localStorage.getItem('profileAvatar') || 'https://via.placeholder.com/150'
	);

	const handleNameChange = (e) => {
		setName(e.target.value);
	};

	const handleAvatarUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setAvatar(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSaveData = () => {
		localStorage.setItem('profileName', name);
		localStorage.setItem('profileAvatar', avatar);
		toast.success('Данные успешно сохранены!');
	};

	const handleGoHome = () => {
		navigate('/'); // Переход на главную страницу
    toast.info('Успешный выход на главную страницу')
	};

	return (
		<ProfileContainer>
			<ProfileAvatar src={avatar} alt='User Avatar' />
			<Typography
				variant='h5'
				gutterBottom
				sx={{ fontWeight: 'bold', color: '#3f51b5' }}
			>
				{name}
			</Typography>

			<TextField
				label='Изменить имя'
				value={name}
				onChange={handleNameChange}
				fullWidth
				margin='normal'
				variant='outlined'
				sx={{
					'& .MuiOutlinedInput-root': {
						'& fieldset': {
							borderColor: '#3f51b5',
						},
						'&:hover fieldset': {
							borderColor: '#3f51b5',
						},
						'&.Mui-focused fieldset': {
							borderColor: '#3f51b5',
						},
					},
				}}
			/>

			<Button
				variant='contained'
				component='label'
				sx={{
					marginTop: 2,
					backgroundColor: '#3f51b5',
					'&:hover': {
						backgroundColor: '#303f9f',
					},
				}}
			>
				Загрузить аватар
				<input type='file' hidden onChange={handleAvatarUpload} />
			</Button>

			<Box sx={{ display: 'flex', gap: 2, marginTop: 3 }}>
				<Button
					variant='contained'
					color='primary'
					onClick={handleSaveData}
					sx={{
						backgroundColor: '#3f51b5',
						'&:hover': {
							backgroundColor: '#303f9f',
						},
					}}
				>
					Сохранить
				</Button>

				<Button
					variant='outlined'
					onClick={handleGoHome}
					sx={{
						borderColor: '#3f51b5',
						color: '#3f51b5',
						'&:hover': {
							borderColor: '#303f9f',
							color: '#303f9f',
						},
					}}
				>
					Выйти на главную
				</Button>
			</Box>
		</ProfileContainer>
	);
};

export default Profile;

// Стилизация контейнера
const ProfileContainer = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	padding: theme.spacing(4),
	backgroundColor: '#f5f5f5',
	minHeight: '100vh',
	transition: 'all 0.3s ease-in-out', // Анимация плавного появления
}));

// Стилизация аватара
const ProfileAvatar = styled(Avatar)(({ theme }) => ({
	width: theme.spacing(15),
	height: theme.spacing(15),
	marginBottom: theme.spacing(2),
	border: '2px solid #3f51b5',
	transition: 'transform 0.3s ease-in-out', // Анимация при наведении
	'&:hover': {
		transform: 'scale(1.1)',
	},
}));
