import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SendIcon from '@mui/icons-material/Send';
import {
	Box,
	IconButton,
	Menu,
	MenuItem,
	TextField,
	Typography,
	styled,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteMessage, sendMessage } from '../store/messageSlice';

const canEditMessage = (timestamp) => {
	const messageTime = new Date(timestamp).getTime();
	const currentTime = new Date().getTime();
	const diffInMinutes = (currentTime - messageTime) / (1000 * 60);
	return diffInMinutes <= 1;
};

const canDeleteMessage = (timestamp) => {
	const messageTime = new Date(timestamp).getTime();
	const currentTime = new Date().getTime();
	const diffInMinutes = (currentTime - messageTime) / (1000 * 60);
	return diffInMinutes <= 3;
};

const StyledMessageBubble = styled(Box)`
	background-color: ${({ sender }) => (sender === 'me' ? '#e1f5fe' : '#fff')};
	border-radius: 20px;
	padding: 10px;
	margin: 5px 0;
	max-width: 70%;
	align-self: ${({ sender }) => (sender === 'me' ? 'flex-end' : 'flex-start')};
`;

const MessageBubble = ({ message, onMenuOpen }) => {
	const canEdit = canEditMessage(message.timestamp);
	const canDelete = canDeleteMessage(message.timestamp);

	return (
		<StyledMessageBubble sender={message.sender}>
			<Typography variant='body1'>{message.text}</Typography>
			<TimeStamp variant='caption'>
				{new Date(message.timestamp).toLocaleTimeString()}
				{message.edited && ' (ред.)'}
			</TimeStamp>

			{message.sender === 'me' && (
				<MessageMenu
					className='message-menu'
					onClick={(e) => onMenuOpen(e, message)}
				>
					<MoreVertIcon fontSize='small' />
				</MessageMenu>
			)}
		</StyledMessageBubble>
	);
};

const Chat = ({ friendName, friendId, onClose }) => {
	const dispatch = useDispatch();
	const messagesFromStore = useSelector(
		(state) => state.messages.messages[friendId] || []
	);
	const [messages, setMessages] = useState(messagesFromStore);
	const [newMessage, setNewMessage] = useState('');
	const [editingMessage, setEditingMessage] = useState(null);
	const messagesEndRef = useRef(null);
	const [anchorEl, setAnchorEl] = useState(null);
	const [selectedMessage, setSelectedMessage] = useState(null);

	useEffect(() => {
		// Загрузка сообщений из localStorage при первом рендере
		const savedMessages = localStorage.getItem(`messages_${friendId}`);
		if (savedMessages) {
			setMessages(JSON.parse(savedMessages));
		}
	}, [friendId]);

	useEffect(() => {
		// Сохранение сообщений в localStorage
		localStorage.setItem(`messages_${friendId}`, JSON.stringify(messages));
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages, friendId]);

	const handleMessageMenuOpen = (event, message) => {
		event.stopPropagation();
		setAnchorEl(event.currentTarget);
		setSelectedMessage(message);
	};

	const handleMessageMenuClose = () => {
		setAnchorEl(null);
		setSelectedMessage(null);
	};

	const handleSendMessage = () => {
		if (newMessage.trim()) {
			const message = {
				id: Date.now(),
				text: newMessage,
				timestamp: new Date().toISOString(),
				sender: 'me',
			};
			dispatch(sendMessage({ friendId, message }));
			setMessages((prevMessages) => [...prevMessages, message]);
			setNewMessage('');
		}
	};

	const handleEditMessage = (message) => {
		setEditingMessage(message);
		setNewMessage(message.text);
		handleMessageMenuClose();
	};

	const handleDeleteMessage = (messageId) => {
		dispatch(deleteMessage({ friendId, messageId }));
		handleMessageMenuClose();
	};

	// Обработка обновления состояния сообщений из Redux
	useEffect(() => {
		setMessages(messagesFromStore);
	}, [messagesFromStore]);

	return (
		<ChatContainer
			as={motion.div}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 20 }}
		>
			<ChatHeader>
				<HeaderLeft>
					<BackButton
						as={motion.button}
						whileHover={{ scale: 1.05, x: -5 }}
						whileTap={{ scale: 0.95 }}
						onClick={onClose}
					>
						<ArrowBackIosNewIcon sx={{ fontSize: 20 }} />
						<span>Назад</span>
					</BackButton>
					<Typography variant='h5' sx={{ fontWeight: 600, color: '#1a237e' }}>
						Чат с {friendName}
					</Typography>
				</HeaderLeft>
				<CloseButton
					as={motion.button}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={onClose}
				>
					Закрыть
				</CloseButton>
			</ChatHeader>

			<MessagesContainer>
				<AnimatePresence mode='popLayout'>
					{messages.map((msg, index) => (
						<motion.div
							key={msg.id || index}
							initial={{ opacity: 0, x: msg.sender === 'me' ? 50 : -50 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, scale: 0.5 }}
							layout
							transition={{ type: 'spring', stiffness: 200, damping: 20 }}
						>
							<MessageBox
								sx={{
									textAlign: msg.sender === 'me' ? 'right' : 'left',
								}}
							>
								<MessageBubble
									message={msg}
									onMenuOpen={handleMessageMenuOpen}
								/>
							</MessageBox>
						</motion.div>
					))}
				</AnimatePresence>
				<div ref={messagesEndRef} />
			</MessagesContainer>

			<Menu
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleMessageMenuClose}
			>
				{selectedMessage && (
					<>
						{canEditMessage(selectedMessage.timestamp) && (
							<MenuItem
								onClick={() => {
									handleEditMessage(selectedMessage);
									handleMessageMenuClose();
								}}
							>
								<EditIcon fontSize='small' sx={{ mr: 1 }} />
								<Typography>Редактировать</Typography>
							</MenuItem>
						)}
						{(canDeleteMessage(selectedMessage.timestamp) ||
							selectedMessage.sender === 'me') && (
							<MenuItem
								onClick={() => {
									handleDeleteMessage(selectedMessage.id);
									handleMessageMenuClose();
								}}
								sx={{ color: 'error.main' }}
							>
								<DeleteIcon fontSize='small' sx={{ mr: 1 }} />
								<Typography>Удалить</Typography>
							</MenuItem>
						)}
					</>
				)}
			</Menu>

			<InputContainer>
				<StyledTextField
					fullWidth
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					onKeyPress={(e) => {
						if (e.key === 'Enter' && !e.shiftKey) {
							e.preventDefault();
							handleSendMessage();
						}
					}}
					placeholder={
						editingMessage
							? 'Редактирование сообщения...'
							: 'Написать сообщение...'
					}
					multiline
					maxRows={4}
					variant='outlined'
				/>
				{editingMessage && (
					<IconButton
						onClick={() => {
							setEditingMessage(null);
							setNewMessage('');
						}}
						color='error'
					>
						<DeleteIcon />
					</IconButton>
				)}
				<SendButton
					as={motion.button}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handleSendMessage}
					disabled={!newMessage.trim()}
				>
					<SendIcon />
				</SendButton>
			</InputContainer>
		</ChatContainer>
	);
};

export default Chat;

// Стилизованные компоненты
const ChatContainer = styled(Box)`
	padding: 24px;
	background: linear-gradient(145deg, #ffffff, #f0f2f5);
	border-radius: 20px;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
	margin-top: 16px;
	display: flex;
	flex-direction: column;
	height: 600px;
	position: relative;
`;

const ChatHeader = styled(Box)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
	padding-bottom: 16px;
	border-bottom: 2px solid #e3f2fd;
`;

const CloseButton = styled(motion.button)`
	background: none;
	border: none;
	color: #1a237e;
	cursor: pointer;
	font-size: 16px;
	padding: 8px 16px;
	border-radius: 8px;
	transition: background 0.3s;

	&:hover {
		background: #e3f2fd;
	}
`;

const MessagesContainer = styled(Box)`
	flex-grow: 1;
	overflow-y: auto;
	margin-bottom: 16px;
	padding: 10px;
	scroll-behavior: smooth;

	&::-webkit-scrollbar {
		width: 6px;
	}

	&::-webkit-scrollbar-track {
		background: #f1f1f1;
		border-radius: 3px;
	}

	&::-webkit-scrollbar-thumb {
		background: #888;
		border-radius: 3px;
	}
`;

const MessageBox = styled(Box)`
	margin-bottom: 12px;
`;

const MessageMenu = styled(motion.create(IconButton))`
  position: absolute;
  top: -8px;
  right: -8px;
  opacity: 0;
  transition: opacity 0.2s;
  background: white;
  padding: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #f5f5f5;
  }
`;

const ActionButton = styled(motion.create(IconButton))`
  background: white;
  padding: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #f5f5f5;
  }
`;

const TimeStamp = styled(Typography)`
  font-size: 0.75rem;
  opacity: 0.7;
  margin-top: 4px;
`;

const InputContainer = styled(Box)`
	display: flex;
	gap: 12px;
	padding: 16px;
	background: white;
	border-radius: 16px;
	box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.05);
`;

const StyledTextField = styled(TextField)`
	.MuiOutlinedInput-root {
		border-radius: 12px;
		background: #f5f5f5;

		&:hover fieldset {
			border-color: #1976d2;
		}

		&.Mui-focused fieldset {
			border-color: #1976d2;
		}
	}
`;

const SendButton = styled(motion.button)`
	background: linear-gradient(135deg, #1976d2, #1565c0);
	color: white;
	border: none;
	border-radius: 12px;
	padding: 8px 16px;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	min-width: 50px;

	&:disabled {
		background: #e0e0e0;
		cursor: not-allowed;
	}
`;

const HeaderLeft = styled(Box)`
	display: flex;
	align-items: center;
	gap: 12px;
`;

const BackButton = styled(motion.button)`
	display: flex;
	align-items: center;
	gap: 4px;
	background: transparent;
	border: none;
	color: #1a237e;
	padding: 8px 16px;
	border-radius: 20px;
	cursor: pointer;
	font-size: 16px;
	font-weight: 500;
	transition: all 0.3s ease;

	&:hover {
		background: rgba(26, 35, 126, 0.1);
	}

	span {
		margin-left: 4px;
	}
`;

const MessageActions = styled(Box)`
	position: absolute;
	right: -70px;
	top: 50%;
	transform: translateY(-50%);
	display: flex;
	gap: 4px;
	opacity: 0;
	transition: opacity 0.2s;
`;

const ActionButton = styled(motion(IconButton))`
	background: white;
	padding: 4px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

	&:hover {
		background: #f5f5f5;
	}
`;
