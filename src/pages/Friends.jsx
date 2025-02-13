import React, { useState, useEffect } from 'react';
import {
	Box,
	Typography,
	List,
	ListItem,
	ListItemAvatar,
	Avatar,
	ListItemText,
	Button,
	TextField,
	styled,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const Friends = () => {
	// Состояние для хранения списка друзей
	const [friends, setFriends] = useState([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [loading, setLoading] = useState(true);

	// Загрузка данных с бэкенда
	useEffect(() => {
		const fetchFriends = async () => {
			try {
				const response = await fetch(
					'https://ce5a84bb27e301c4.mokky.dev/friends'
				); // Замените на ваш URL
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

	// Функция для добавления друга
	const handleAddFriend = (id) => {
		setFriends((prevFriends) =>
			prevFriends.map((friend) =>
				friend.id === id ? { ...friend, status: 'online' } : friend
			)
		);
	};

	// Функция для удаления друга
	const handleRemoveFriend = (id) => {
		setFriends((prevFriends) =>
			prevFriends.map((friend) =>
				friend.id === id ? { ...friend, status: 'offline' } : friend
			)
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

			{/* Анимированный список друзей */}
			<List>
				<AnimatePresence>
					{filteredFriends.map((friend) => (
						<motion.div
							key={friend.id}
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.5 }}
						>
							<ListItem sx={{ display: 'flex', alignItems: 'center' }}>
								<ListItemAvatar>
									<Avatar src={friend.avatar} alt={friend.name} />
								</ListItemAvatar>
								<ListItemText
									primary={friend.name}
									secondary={
										friend.status === 'online' ? 'В сети' : 'Не в сети'
									}
									sx={{
										color: friend.status === 'online' ? '#4caf50' : '#f44336',
									}}
								/>
								<Box sx={{ display: 'flex', gap: 1 }}>
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
								</Box>
							</ListItem>
						</motion.div>
					))}
				</AnimatePresence>
			</List>
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
