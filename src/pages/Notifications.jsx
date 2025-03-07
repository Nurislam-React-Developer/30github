import React, { useEffect, useState } from 'react';
import {
	Box,
	Typography,
	List,
	ListItem,
	ListItemText,
	Button,
	styled,
	Avatar,
	Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
	const navigate = useNavigate();
	const [notifications, setNotifications] = useState([]);

	useEffect(() => {
		// Load notifications from localStorage
		const savedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
		setNotifications(savedNotifications);
	}, []);

	const handleAcceptFriend = (notificationId) => {
		const updatedNotifications = notifications.filter(n => n.id !== notificationId);
		setNotifications(updatedNotifications);
		localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
	};

	const handleDeclineFriend = (notificationId) => {
		const updatedNotifications = notifications.filter(n => n.id !== notificationId);
		setNotifications(updatedNotifications);
		localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
	};

	const handleViewPost = (postId) => {
		navigate(`/profile?postId=${postId}`);
	};
	return (
		<NotificationsContainer>
			<Typography
				variant='h4'
				gutterBottom
				sx={{ textAlign: 'center', color: '#3f51b5' }}
			>
				Уведомления
			</Typography>

			{!notifications || notifications.length === 0 ? (
				<Typography variant='body1' sx={{ textAlign: 'center', color: '#666' }}>
					Нет новых уведомлений
				</Typography>
			) : (
				<List>
					{notifications.map((notification) => (
						<React.Fragment key={notification.id}>
							<ListItem sx={{ display: 'flex', alignItems: 'center' }}>
								<Avatar
									src={notification.senderAvatar}
									alt={notification.sender}
									sx={{ mr: 2 }}
								/>
								{notification.type === 'friend_request' ? (
									<>
										<ListItemText
											primary={`${notification.sender} хочет добавить вас в друзья`}
											secondary='Новый запрос'
										/>
										<Box sx={{ display: 'flex', gap: 1 }}>
											<Button
												variant='contained'
												color='primary'
												onClick={() => handleAcceptFriend(notification.id)}
											>
												Принять
											</Button>
											<Button
												variant='outlined'
												color='error'
												onClick={() => handleDeclineFriend(notification.id)}
											>
												Отклонить
											</Button>
										</Box>
									</>
								) : notification.type === 'like' ? (
									<>
										<ListItemText
											primary={`${notification.sender} лайкнул ваш пост`}
											secondary={new Date(notification.timestamp).toLocaleString()}
										/>
										<Button
											variant='text'
											color='primary'
											onClick={() => handleViewPost(notification.postId)}
										>
											Посмотреть пост
										</Button>
									</>
								) : notification.type === 'comment_like' ? (
									<>
										<ListItemText
											primary={
												<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
													<Typography variant="body1">
														{`${notification.user} лайкнул ваш комментарий`}
													</Typography>
												</Box>
											}
											secondary={new Date(notification.timestamp).toLocaleString()}
										/>
										<Button
											variant='text'
											color='primary'
											onClick={() => handleViewPost(notification.postId)}
										>
											Посмотреть комментарий
										</Button>
									</>
								) : (
									<>
										<ListItemText
											primary={
												<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
													<Typography variant="body1" sx={{ fontWeight: 'medium' }}>
														{`${notification.user} оставил комментарий:`}
													</Typography>
													<Typography
														variant="body2"
														sx={{
															bgcolor: darkMode ? 'rgba(187, 134, 252, 0.1)' : 'rgba(63, 81, 181, 0.1)',
															color: darkMode ? '#fff' : '#000',
															p: 1.5,
															borderRadius: 1,
															fontStyle: 'italic',
															boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
														}}
													>
														{notification.commentText}
													</Typography>
												</Box>
											}
											secondary={new Date(notification.timestamp).toLocaleString()}
										/>
										<Button
											variant='text'
											color='primary'
											onClick={() => handleViewPost(notification.postId)}
										>
											Посмотреть комментарий
										</Button>
									</>
								)}
							</ListItem>
							<Divider />
						</React.Fragment>
					))}
				</List>
			)}
		</NotificationsContainer>
	);
};

export default Notifications;

// Стилизация контейнера
const NotificationsContainer = styled(Box)(({ theme }) => ({
	padding: theme.spacing(4),
	backgroundColor: '#f5f5f5',
	minHeight: '100vh',
}));
