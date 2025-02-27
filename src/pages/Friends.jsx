import {
	Avatar,
	Box,
	Button,
	Card,
	CardContent,
	styled,
	Typography,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addFriend, removeFriend } from '../store/frendSlice';
import { getFrends } from '../store/request/request';
import TetrisLoader from '../components/ui/TetrisLoader';

const Friends = () => {
	const dispatch = useDispatch();
	const {
		frends,
		isLoading,
		error,
		friendsList = [],
	} = useSelector((state) => state.frend);

	useEffect(() => {
		dispatch(getFrends());
	}, [dispatch]);

	const handleAddFriend = (id) => {
		dispatch(addFriend(id));
	};

	const handleRemoveFriend = (id) => {
		dispatch(removeFriend(id));
	};

	if (isLoading) {
		return <TetrisLoader/>;
	}

	if (error) {
		return <Typography variant='h6'>Ошибка: {error}</Typography>;
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
														friend.status === 'online' ? '#4caf50' : '#f44336',
												}}
											>
												{friend.status === 'online' ? 'В сети' : 'Не в сети'}
											</Typography>
										</CardContent>
									</Link>
									<Box sx={{ p: 2, textAlign: 'center' }}>
										{!friendsList?.includes(friend.id) ? (
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
		</FriendsContainer>
	);
};

export default Friends;

const FriendsContainer = styled(Box)(({ theme }) => ({
	padding: theme.spacing(4),
	backgroundColor: '#f5f5f5',
	minHeight: '100vh',
}));

const FriendCard = styled(Card)(({ theme }) => ({
	width: 200,
	transition: 'transform 0.3s ease-in-out',
	'&:hover': {
		transform: 'scale(1.05)',
	},
}));
