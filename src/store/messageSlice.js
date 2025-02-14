import { createSlice } from '@reduxjs/toolkit';

const loadMessagesFromStorage = () => {
	try {
		const savedMessages = localStorage.getItem('allMessages');
		return savedMessages ? JSON.parse(savedMessages) : {};
	} catch (error) {
		console.error('Error loading messages:', error);
		return {};
	}
};

const initialState = {
	messages: loadMessagesFromStorage(),
};

const messagesSlice = createSlice({
	name: 'messages',
	initialState,
	reducers: {
		sendMessage: (state, action) => {
			const { friendId, message } = action.payload;
			if (!state.messages[friendId]) {
				state.messages[friendId] = [];
			}
			state.messages[friendId].push(message);
			localStorage.setItem('allMessages', JSON.stringify(state.messages));
		},
		deleteMessage: (state, action) => {
			const { friendId, messageId } = action.payload;
			if (state.messages[friendId]) {
				state.messages[friendId] = state.messages[friendId].filter(
					(msg) => msg.id !== messageId
				);
				localStorage.setItem('allMessages', JSON.stringify(state.messages));
			}
		},
		editMessage: (state, action) => {
			const { friendId, messageId, newText } = action.payload;
			if (state.messages[friendId]) {
				const message = state.messages[friendId].find(
					(msg) => msg.id === messageId
				);
				if (message) {
					message.text = newText;
					message.edited = true;
					localStorage.setItem('allMessages', JSON.stringify(state.messages));
				}
			}
		},
	},
});

export const { sendMessage, deleteMessage, editMessage } =
	messagesSlice.actions;
  
export default messagesSlice
