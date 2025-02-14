import styled from '@emotion/styled';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

const Chat = ({ friendName, onClose }) => {
	const chatKey = `chat_${friendName}`;
	const [messages, setMessages] = useState(() => {
		const savedMessages = localStorage.getItem(chatKey);
		return savedMessages ? JSON.parse(savedMessages) : [];
	});
	const [newMessage, setNewMessage] = useState('');
	const messagesEndRef = useRef(null);
	const [anchorEl, setAnchorEl] = useState(null);
	const [selectedMessageIndex, setSelectedMessageIndex] = useState(null);

	useEffect(() => {
		localStorage.setItem(chatKey, JSON.stringify(messages));
	}, [messages, chatKey]);

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
				timestamp: new Date().toISOString(),
				id: Date.now(),
			};
			setMessages([...messages, newMsg]);
			setNewMessage('');
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	const handleMessageMenuOpen = (event, index) => {
		setAnchorEl(event.currentTarget);
		setSelectedMessageIndex(index);
	};

	const handleMessageMenuClose = () => {
		setAnchorEl(null);
		setSelectedMessageIndex(null);
	};

	const handleDeleteMessage = () => {
		if (selectedMessageIndex !== null) {
			const newMessages = messages.filter(
				(_, index) => index !== selectedMessageIndex
			);
			setMessages(newMessages);
			localStorage.setItem(chatKey, JSON.stringify(newMessages));
		}
		handleMessageMenuClose();
	};

	const handleEditMessage = () => {
		if (selectedMessageIndex !== null) {
			const messageToEdit = messages[selectedMessageIndex];
			setNewMessage(messageToEdit.text);
			const newMessages = messages.filter(
				(_, index) => index !== selectedMessageIndex
			);
			setMessages(newMessages);
			localStorage.setItem(chatKey, JSON.stringify(newMessages));
		}
		handleMessageMenuClose();
	};

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
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={onClose}
					>
						<ArrowBackIcon />
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
									index={index}
									handleMessageMenuOpen={handleMessageMenuOpen}
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
				<MenuItem onClick={handleEditMessage}>
					<EditIcon fontSize='small' sx={{ mr: 1 }} />
					<Typography>Редактировать</Typography>
				</MenuItem>
				<MenuItem onClick={handleDeleteMessage} sx={{ color: 'error.main' }}>
					<DeleteIcon fontSize='small' sx={{ mr: 1 }} />
					<Typography>Удалить</Typography>
				</MenuItem>
			</Menu>

			<InputContainer>
				<StyledTextField
					fullWidth
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					onKeyPress={handleKeyPress}
					placeholder='Введите сообщение...'
					multiline
					maxRows={4}
					variant='outlined'
				/>
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

const MessageBubble = ({ message, index, handleMessageMenuOpen }) => {
	return (
		<StyledMessageBubble sender={message.sender}>
			<Typography variant='body1'>{message.text}</Typography>
			<TimeStamp variant='caption'>
				{new Date(message.timestamp).toLocaleTimeString()}
			</TimeStamp>

			{message.sender === 'me' && (
				<MessageMenu
					size='small'
					onClick={(e) => handleMessageMenuOpen(e, index)}
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
				>
					<MoreVertIcon fontSize='small' />
				</MessageMenu>
			)}
		</StyledMessageBubble>
	);
};

const StyledMessageBubble = styled(Box)`
	display: inline-block;
	padding: 12px 16px;
	border-radius: 16px;
	max-width: 70%;
	word-wrap: break-word;
	position: relative;
	background: ${(props) =>
		props.sender === 'me'
			? 'linear-gradient(135deg, #00b0ff, #1976d2)'
			: 'linear-gradient(135deg, #f5f5f5, #e0e0e0)'};
	color: ${(props) => (props.sender === 'me' ? '#fff' : '#000')};
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

	&:hover .message-menu {
		opacity: 1;
	}
`;

const MessageMenu = styled(motion(IconButton))`
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
	background: none;
	border: none;
	color: #1a237e;
	cursor: pointer;
	padding: 8px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: background-color 0.3s;

	&:hover {
		background-color: #e3f2fd;
	}

	svg {
		font-size: 24px;
	}
`;
