import { Avatar, Box, Button, styled, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Chat from '../components/Chat'; // Импортируем компонент чата
import { getFrends } from '../store/request/request';

const FrendProfile = () => {
	const { id } = useParams();
	const dispatch = useDispatch();
	const { frends, isLoading } = useSelector((state) => state.frend);
	const [isChatOpen, setIsChatOpen] = React.useState(false);

	useEffect(() => {
		dispatch(getFrends());
	}, [dispatch]);

	// Находим друга по id из URL
	const friend = frends.find((f) => f.id === parseInt(id));

	if (isLoading) {
		return <Typography variant='h6'>Загрузка...</Typography>;
	}

	if (!friend) {
		return <Typography variant='h6'>Друг не найден</Typography>;
	}

	return (
		<ProfileContainer>
			{/* Информация о друге */}
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

			{/* Кнопки действий */}
			<Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
				<Button
					variant='contained'
					color='primary'
					onClick={() => setIsChatOpen(true)} // Открываем чат
				>
					Написать сообщение
				</Button>
				<Button variant='outlined' color='error'>
					Удалить из друзей
				</Button>
			</Box>

			{/* Чат */}
			{isChatOpen && (
				<Chat
					friendName={friend.name} // Передаем имя друга
					onClose={() => setIsChatOpen(false)} // Закрываем чат
				/>
			)}
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
