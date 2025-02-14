import { Avatar, Box, Button, styled, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Chat from '../components/Chat';
import { getFrends } from '../store/request/request';

const FrendProfile = () => {
	const { id } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { frends, isLoading } = useSelector((state) => state.frend);
	const [isChatOpen, setIsChatOpen] = useState(false);
	const [selectedFriend, setSelectedFriend] = useState(null);

	useEffect(() => {
		if (!frends || frends.length === 0) {
			dispatch(getFrends());
		}
	}, [dispatch, frends]);

	useEffect(() => {
		const friend = frends.find((f) => f.id === parseInt(id));
		setSelectedFriend(friend);
	}, [id, frends]);

	if (isLoading) {
		return <Typography variant='h6'>Загрузка...</Typography>;
	}

	if (!selectedFriend) {
		navigate('/friends');
		return null;
	}

	const handleOpenChat = (friend) => {
		setSelectedFriend(friend);
		setIsChatOpen(true);
	};

	return (
		<ProfileContainer>
			{/* Информация о друге */}
			<Box sx={{ textAlign: 'center' }}>
				<Avatar
					src={selectedFriend.avatar}
					alt={selectedFriend.name}
					sx={{ width: 150, height: 150, margin: 'auto' }}
				/>
				<Typography variant='h4' gutterBottom sx={{ mt: 2 }}>
					{selectedFriend.name}
				</Typography>
				<Typography
					variant='body1'
					sx={{
						color: selectedFriend.status === 'online' ? '#4caf50' : '#f44336',
					}}
				>
					{selectedFriend.status === 'online' ? 'В сети' : 'Не в сети'}
				</Typography>
			</Box>

			{/* Кнопки действий */}
			<Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
				<Button
					variant='contained'
					color='primary'
					onClick={() => setIsChatOpen(true)}
				>
					Написать сообщение
				</Button>
				<Button variant='outlined' color='error'>
					Удалить из друзей
				</Button>
			</Box>

			{/* Список других друзей */}
			{isChatOpen && (
				<Box sx={{ mt: 4 }}>
					<Typography variant='h6' gutterBottom>
						Другие друзья
					</Typography>
					<Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
						{frends
							.filter((f) => f.id !== selectedFriend.id)
							.map((friend) => (
								<FriendChip
									key={friend.id}
									onClick={() => handleOpenChat(friend)}
								>
									<Avatar
										src={friend.avatar}
										alt={friend.name}
										sx={{ width: 32, height: 32 }}
									/>
									<Typography variant='body2'>{friend.name}</Typography>
								</FriendChip>
							))}
					</Box>
				</Box>
			)}

			{isChatOpen && (
				<Chat
					friendName={selectedFriend.name}
					onClose={() => setIsChatOpen(false)}
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

const FriendChip = styled(Box)(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	gap: theme.spacing(1),
	padding: theme.spacing(1, 2),
	backgroundColor: 'white',
	borderRadius: 20,
	cursor: 'pointer',
	transition: 'all 0.3s ease',
	boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
	'&:hover': {
		transform: 'translateY(-2px)',
		boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
	},
}));
