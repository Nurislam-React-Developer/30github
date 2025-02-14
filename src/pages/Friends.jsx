import {
	Avatar,
	Box,
	Button,
	Card,
	CardContent,
	styled,
	TextField,
	Typography,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getFrends } from '../store/request/request';
import Notifications from './Notifications'; // Импортируем компонент уведомлений
import { addFriend, removeFriend } from '../store/frendSlice';

const Friends = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { frends, isLoading, error } = useSelector((state) => state.frend);

	// Состояния для друзей и уведомлений
	const [friends, setFriends] = useState([]);
	const [notifications, setNotifications] = useState([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [activeTab, setActiveTab] = useState('friends'); // Переключение между друзьями и уведомлениями

	// Загрузка данных с мокового API
	useEffect(() => {
		dispatch(getFrends());
	}, [dispatch]);

	console.log('Состояние frends:', frends); // Добавляем для отладки

	// Функция для добавления друга (создание уведомления)
	const handleAddFriend = (id) => {
		dispatch(addFriend(id));
	};

	// Функция для удаления друга
	const handleRemoveFriend = (id) => {
		dispatch(removeFriend(id));
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

	if (isLoading) {
		return <Typography variant='h6'>Загрузка...</Typography>;
	}

	if (error) {
		return <Typography variant='h6'>Ошибка: {error}</Typography>;
	}

	// Обработчик клика на карточку друга
	const handleViewProfile = (id) => {
		navigate(`/profile/${id}`); // Переход на страницу профиля с ID друга
	};

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
							{frends &&
								frends.map((friend) => (
									<motion.div
										key={friend.id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -20 }}
										transition={{ duration: 0.3 }}
									>
										<FriendCard>
											<Link
												to={`/profile/${friend.id}`}
												style={{ textDecoration: 'none' }}
											>
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
																friend.status === 'online'
																	? '#4caf50'
																	: '#f44336',
														}}
													>
														{friend.status === 'online'
															? 'В сети'
															: 'Не в сети'}
													</Typography>
												</CardContent>
											</Link>
											<Box sx={{ p: 2, textAlign: 'center' }}>
												{!friend.isFriend ? (
													<Button
														variant='contained'
														color='primary'
														onClick={() => handleAddFriend(friend.id)}
													>
														Добавить в друзья
													</Button>
												) : (
													<Button
														variant='outlined'
														color='error'
														onClick={() => handleRemoveFriend(friend.id)}
													>
														Удалить из друзей
													</Button>
												)}
											</Box>
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
	transition: 'transform 0.3s ease-in-out',
	'&:hover': {
		transform: 'scale(1.05)',
	},
}));
