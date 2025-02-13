import React from 'react';
import {
	Box,
	Typography,
	List,
	ListItem,
	ListItemText,
	Button,
	styled,
} from '@mui/material';

const Notifications = ({ notifications, onAccept, onDecline }) => {
	return (
		<NotificationsContainer>
			<Typography
				variant='h4'
				gutterBottom
				sx={{ textAlign: 'center', color: '#3f51b5' }}
			>
				Уведомления
			</Typography>

			{/* Проверяем, передан ли массив уведомлений */}
			{!notifications || notifications.length === 0 ? (
				<Typography variant='body1' sx={{ textAlign: 'center', color: '#666' }}>
					Нет новых уведомлений
				</Typography>
			) : (
				<List>
					{notifications.map((notification) => (
						<ListItem
							key={notification.id}
							sx={{ display: 'flex', alignItems: 'center' }}
						>
							<ListItemText
								primary={`${notification.sender} хочет добавить вас в друзья`}
								secondary='Новый запрос'
							/>
							<Box sx={{ display: 'flex', gap: 1 }}>
								<Button
									variant='contained'
									color='primary'
									onClick={() => onAccept(notification.id)}
								>
									Принять
								</Button>
								<Button
									variant='outlined'
									color='error'
									onClick={() => onDecline(notification.id)}
								>
									Отклонить
								</Button>
							</Box>
						</ListItem>
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
