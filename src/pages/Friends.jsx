import { List, ListItem, ListItemAvatar, ListItemText, Typography, Box, Button, Avatar, styled } from '@mui/material';
import React, { useState } from 'react';

const Friends = () => {
	const initialFriends = [
		{
			id: 1,
			name: 'Анна',
			avatar: 'https://via.placeholder.com/50',
			status: 'online',
		},
		{
			id: 2,
			name: 'Иван',
			avatar: 'https://via.placeholder.com/50',
			status: 'offline',
		},
		{
			id: 3,
			name: 'Мария',
			avatar: 'https://via.placeholder.com/50',
			status: 'online',
		},
		{
			id: 4,
			name: 'Алексей',
			avatar: 'https://via.placeholder.com/50',
			status: 'offline',
		},
	];

	const [friends, setFriends] = useState(initialFriends);

	// Функция для добавления друга
	const handleAddFriend = (id) => {
		setFriends((prevFriends) =>
			prevFriends.map((friend) =>
				friend.id === id ? { ...friend, status: 'online' } : friend
			)
		);
	};

  const handleRemoveFriend = (id) => {
    setFriends((prevFriends) => 
      prevFriends.map((friend) => 
      friend.id === id ? {...friend, status: 'offline'}: friend
      )
    )
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
			<List>
				{friends.map((friend) => (
					<ListItem
						key={friend.id}
						sx={{ display: 'flex', alignItems: 'center' }}
					>
						<ListItemAvatar>
							<Avatar src={friend.avatar} alt={friend.name} />
						</ListItemAvatar>
						<ListItemText
							primary={friend.name}
							secondary={friend.status === 'online' ? 'В сети' : 'Не в сети'}
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
				))}
			</List>
		</FriendsContainer>
	);
};

export default Friends;


const FriendsContainer = styled(Box)(({ theme }) => ({
	padding: theme.spacing(4),
	backgroundColor: '#f5f5f5',
	minHeight: '100vh',
}));