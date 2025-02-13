import React, { useState } from 'react';
import { Box, Typography, TextField, Button, styled } from '@mui/material';

const Chat = ({ friendName }) => {
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState('');

	const handleSendMessage = () => {
		if (newMessage.trim()) {
			setMessages([...messages, { text: newMessage, sender: 'me' }]);
			setNewMessage('');
		}
	};

	return (
		<ChatContainer>
			<Typography variant='h5' gutterBottom>
				Чат с {friendName}
			</Typography>

			{/* История сообщений */}
			<Box sx={{ flexGrow: 1, overflowY: 'auto', marginBottom: 2 }}>
				{messages.map((msg, index) => (
					<Typography
						key={index}
						sx={{ textAlign: msg.sender === 'me' ? 'right' : 'left' }}
					>
						{msg.text}
					</Typography>
				))}
			</Box>

			{/* Поле для ввода сообщения */}
			<Box sx={{ display: 'flex', gap: 1 }}>
				<TextField
					fullWidth
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					placeholder='Введите сообщение...'
				/>
				<Button variant='contained' color='primary' onClick={handleSendMessage}>
					Отправить
				</Button>
			</Box>
		</ChatContainer>
	);
};

export default Chat;

// Стилизация контейнера
const ChatContainer = styled(Box)(({ theme }) => ({
	padding: theme.spacing(4),
	backgroundColor: '#f5f5f5',
	minHeight: '100vh',
}));
