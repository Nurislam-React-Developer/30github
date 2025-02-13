import React, { useState, useEffect } from 'react';
import {
	Box,
	Typography,
	TextField,
	Button,
	Card,
	CardContent,
	CardActions,
	Avatar,
	styled,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import Notifications from './Notifications'; // Импортируем компонент уведомлений

const Friends = () => {
	// Состояния для друзей и уведомлений
	const [friends, setFriends] = useState([]);
	const [notifications, setNotifications] = useState([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState('friends'); // Переключение между друзьями и уведомлениями

	// Загрузка данных с мокового API
	useEffect(() => {
		const fetchFriends = async () => {
			try {
				const response = await fetch('https://ce5a84bb27e301c4.mokky.dev/friends'); // Замените на ваш Mocky URL
				const data = await response.json();
				setFriends(data);
				setLoading(false);
			} catch (error) {
				console.error('Ошибка при загрузке данных:', error);
				setLoading(false);
			}
		};

		fetchFriends();
	}, []);

	// Функция для добавления друга (создание уведомления)
	const handleAddFriend = (id) => {
		const friend = friends.find((f) => f.id === id);
		if (friend) {
			setNotifications((prevNotifications) => [
				...prevNotifications,
				{ id: Date.now(), sender: friend.name },
			]);
			setFriends((prevFriends) =>
				prevFriends.map((f) => (f.id === id ? { ...f, status: 'pending' } : f))
			);
		}
	};

	// Функция для удаления друга
	const handleRemoveFriend = (id) => {
		setFriends((prevFriends) =>
			prevFriends.map((friend) =>
				friend.id === id ? { ...friend, status: 'offline' } : friend
			)
		);
	};

	// Функция для принятия запроса в друзья
	const handleAcceptNotification = (id) => {
		setNotifications((prevNotifications) =>
			prevNotifications.filter((n) => n.id !== id)
		);
	};

	// Функция для отклонения запроса в друзья
	const handleDeclineNotification = (id) => {
		setNotifications((prevNotifications) =>
			prevNotifications.filter((n) => n.id !== id)
		);
	};

	// Фильтрация друзей по имени
	const filteredFriends = friends.filter((friend) =>
		friend.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	if (loading) {
		return <Typography variant='h6'>Загрузка...</Typography>;
	}

	return (
		<FriendsContainer>
			{/* Переключение между друзьями и уведомлениями */}
			<Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
				<Button
					variant={activeTab === 'friends' ? 'contained' : 'outlined'}
					color='primary'
					onClick={() => setActiveTab('friends')}
				>
					Друзья
				</Button>
				<Button
					variant={activeTab === 'notifications' ? 'contained' : 'outlined'}
					color='primary'
					onClick={() => setActiveTab('notifications')}
					sx={{ marginLeft: 2 }}
				>
					Уведомления
				</Button>
			</Box>

			{activeTab === 'friends' ? (
				<>
					<Typography
						variant='h4'
						gutterBottom
						sx={{ textAlign: 'center', color: '#3f51b5' }}
					>
						Список друзей
					</Typography>

					{/* Поле поиска */}
					<TextField
						label='Поиск друзей'
						fullWidth
						margin='normal'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						sx={{
							'& .MuiOutlinedInput-root': {
								'& fieldset': { borderColor: '#3f51b5' },
								'&:hover fieldset': { borderColor: '#3f51b5' },
								'&.Mui-focused fieldset': { borderColor: '#3f51b5' },
							},
						}}
					/>

					{/* Список друзей */}
					<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
						<AnimatePresence>
							{filteredFriends.map((friend) => (
								<motion.div
									key={friend.id}
									initial={{ opacity: 0, y: -20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{ duration: 0.5 }}
								>
									<FriendCard>
										<CardContent sx={{ textAlign: 'center' }}>
											<Avatar
												src={friend.avatar}
												alt={friend.name}
												sx={{ width: 80, height: 80, margin: 'auto' }}
											/>
											<Typography variant='h6' sx={{ mt: 1 }}>
												{friend.name}
											</Typography>
											<Typography
												variant='body2'
												sx={{
													color:
														friend.status === 'online' ? '#4caf50' : '#f44336',
												}}
											>
												{friend.status === 'online'
													? 'В сети'
													: friend.status === 'pending'
													? 'Запрос отправлен'
													: 'Не в сети'}
											</Typography>
										</CardContent>
										<CardActions sx={{ justifyContent: 'center' }}>
											{friend.status === 'offline' && (
												<Button
													variant='contained'
													color='primary'
													onClick={() => handleAddFriend(friend.id)}
												>
													Добавить в друзья
												</Button>
											)}
											{friend.status === 'online' && (
												<Button
													variant='outlined'
													color='error'
													onClick={() => handleRemoveFriend(friend.id)}
												>
													Удалить из друзей
												</Button>
											)}
											{friend.status === 'pending' && (
												<Button variant='text' color='secondary' disabled>
													Запрос отправлен
												</Button>
											)}
										</CardActions>
									</FriendCard>
								</motion.div>
							))}
						</AnimatePresence>
					</Box>
				</>
			) : (
				<Notifications
					notifications={notifications}
					onAccept={handleAcceptNotification}
					onDecline={handleDeclineNotification}
				/>
			)}
		</FriendsContainer>
	);
};

export default Friends;

// Стилизация контейнера
const FriendsContainer = styled(Box)(({ theme }) => ({
	padding: theme.spacing(4),
	backgroundColor: '#f5f5f5',
	minHeight: '100vh',
}));

// Стилизация карточки друга
const FriendCard = styled(Card)(({ theme }) => ({
	width: 200,
	cursor: 'pointer',
	transition: 'transform 0.3s ease-in-out',
	'&:hover': {
		transform: 'scale(1.05)',
	},
}));
