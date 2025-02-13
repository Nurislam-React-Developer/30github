import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, TextField, Button, styled } from '@mui/material';

const Chat = ({ friendName, onClose }) => {
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState('');
	const messagesEndRef = useRef(null);

	const handleSendMessage = () => {
		if (newMessage.trim()) {
			setMessages([...messages, { text: newMessage, sender: 'me' }]);
			setNewMessage('');
		}
	};

	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [messages]);

	return (
		<ChatContainer>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<Typography variant='h5' gutterBottom>
					Чат с {friendName}
				</Typography>
				<Button variant='text' color='primary' onClick={onClose}>
					Закрыть
				</Button>
			</Box>

			{/* История сообщений */}
			<Box
				sx={{
					flexGrow: 1,
					overflowY: 'auto',
					marginBottom: 2,
					maxHeight: '400px',
				}}
			>
				{messages.map((msg, index) => (
					<Typography
						key={index}
						sx={{
							textAlign: msg.sender === 'me' ? 'right' : 'left',
							backgroundColor: msg.sender === 'me' ? '#e3f2fd' : '#ffebee',
							padding: '8px',
							borderRadius: '8px',
							maxWidth: '70%',
							margin: '4px 0',
						}}
					>
						{msg.text}
					</Typography>
				))}
				<div ref={messagesEndRef} />
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
	backgroundColor: '#ffffff',
	border: '1px solid #ddd',
	borderRadius: '8px',
	marginTop: theme.spacing(2),
}));
