import { Box, Button, styled, TextField, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

const Chat = ({ friendName, onClose }) => {
	// Создаем уникальный ключ для чата с конкретным другом
	const chatKey = `chat_${friendName}`;

	// Получаем сообщения из localStorage при инициализации
	const [messages, setMessages] = useState(() => {
		const savedMessages = localStorage.getItem(chatKey);
		return savedMessages ? JSON.parse(savedMessages) : [];
	});

	const [newMessage, setNewMessage] = useState('');
	const messagesEndRef = useRef(null);

	// Сохраняем сообщения в localStorage при каждом изменении
	useEffect(() => {
		localStorage.setItem(chatKey, JSON.stringify(messages));
	}, [messages, chatKey]);

	// Автопрокрутка к последнему сообщению
	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [messages]);

	const handleSendMessage = () => {
		if (newMessage.trim()) {
			const newMsg = {
				text: newMessage,
				sender: 'me',
				timestamp: new Date().toISOString(), // Добавляем временную метку
			};
			setMessages([...messages, newMsg]);
			setNewMessage('');
		}
	};

	// Обработка отправки по Enter
	const handleKeyPress = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

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
					padding: '10px',
				}}
			>
				{messages.map((msg, index) => (
					<MessageBox
						key={index}
						sx={{
							textAlign: msg.sender === 'me' ? 'right' : 'left',
							marginBottom: '8px',
						}}
					>
						<MessageBubble
							sender={msg.sender}
							sx={{
								backgroundColor: msg.sender === 'me' ? '#e3f2fd' : '#ffebee',
							}}
						>
							<Typography variant='body1'>{msg.text}</Typography>
							<Typography variant='caption' sx={{ opacity: 0.7 }}>
								{new Date(msg.timestamp).toLocaleTimeString()}
							</Typography>
						</MessageBubble>
					</MessageBox>
				))}
				<div ref={messagesEndRef} />
			</Box>

			{/* Поле для ввода сообщения */}
			<Box sx={{ display: 'flex', gap: 1 }}>
				<TextField
					fullWidth
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					onKeyPress={handleKeyPress}
					placeholder='Введите сообщение...'
					multiline
					maxRows={4}
				/>
				<Button variant='contained' color='primary' onClick={handleSendMessage}>
					Отправить
				</Button>
			</Box>
		</ChatContainer>
	);
};

export default Chat;

// Стилизованные компоненты
const ChatContainer = styled(Box)(({ theme }) => ({
	padding: theme.spacing(4),
	backgroundColor: '#ffffff',
	border: '1px solid #ddd',
	borderRadius: '8px',
	marginTop: theme.spacing(2),
	display: 'flex',
	flexDirection: 'column',
	height: '600px',
}));

const MessageBox = styled(Box)({
	marginBottom: '8px',
});

const MessageBubble = styled(Box)(({ sender }) => ({
	display: 'inline-block',
	padding: '8px 12px',
	borderRadius: '12px',
	maxWidth: '70%',
	wordWrap: 'break-word',
	'& p': {
		margin: 0,
	},
}));
