import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Avatar, Button, styled } from '@mui/material';

const FrendProfile = () => {
	const { id } = useParams(); // Получаем ID друга из URL
	const [friend, setFriend] = useState(null);

	// Загрузка данных о друге (можно использовать моковый API)
	useEffect(() => {
		const fetchFriend = async () => {
			try {
				const response = await fetch(
					`${process.env.API_URL}/friends/${id}`
				); // Замените на ваш Mocky URL
				const data = await response.json();
				setFriend(data);
			} catch (error) {
				console.error('Ошибка при загрузке данных:', error);
			}
		};

		fetchFriend();
	}, [id]);

	if (!friend) {
		return <Typography variant='h6'>Загрузка...</Typography>;
	}

	return (
		<ProfileContainer>
			<Box sx={{ textAlign: 'center' }}>
				<Avatar
					src={friend.avatar}
					alt={friend.name}
					sx={{ width: 150, height: 150, margin: 'auto' }}
				/>
				<Typography variant='h4' gutterBottom sx={{ mt: 2 }}>
					{friend.name}
				</Typography>
				<Typography
					variant='body1'
					sx={{ color: friend.status === 'online' ? '#4caf50' : '#f44336' }}
				>
					{friend.status === 'online' ? 'В сети' : 'Не в сети'}
				</Typography>
			</Box>

			<Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
				<Button variant='contained' color='primary'>
					Написать сообщение
				</Button>
				<Button variant='outlined' color='error'>
					Удалить из друзей
				</Button>
			</Box>
		</ProfileContainer>
	);
};

export default FrendProfile;

// Стилизация контейнера
const ProfileContainer = styled(Box)(({ theme }) => ({
	padding: theme.spacing(4),
	backgroundColor: '#f5f5f5',
	minHeight: '100vh',
}));
