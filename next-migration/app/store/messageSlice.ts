'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface Message {
	id: number;
	senderId: number;
	receiverId: number;
	text: string;
	timestamp: string;
	read: boolean;
}

interface MessageState {
	messages: Record<number, Message[]>; // Keyed by conversation ID (friend ID)
	loading: boolean;
	error: string | null;
}

const initialState: MessageState = {
	messages: {},
	loading: false,
	error: null,
};

const messageSlice = createSlice({
	name: 'message',
	initialState,
	reducers: {
		fetchMessagesStart(state) {
			state.loading = true;
			state.error = null;
		},
		fetchMessagesSuccess(
			state,
			action: PayloadAction<{ friendId: number; messages: Message[] }>
		) {
			const { friendId, messages } = action.payload;
			state.messages[friendId] = messages;
			state.loading = false;
		},
		fetchMessagesFailure(state, action: PayloadAction<string>) {
			state.loading = false;
			state.error = action.payload;
		},
		sendMessage(
			state,
			action: PayloadAction<{ friendId: number; message: Message }>
		) {
			const { friendId, message } = action.payload;
			if (!state.messages[friendId]) {
				state.messages[friendId] = [];
			}
			state.messages[friendId].push(message);
		},
		markAsRead(
			state,
			action: PayloadAction<{ friendId: number; messageId: number }>
		) {
			const { friendId, messageId } = action.payload;
			const messages = state.messages[friendId];
			if (messages) {
				const messageIndex = messages.findIndex((msg) => msg.id === messageId);
				if (messageIndex !== -1) {
					messages[messageIndex].read = true;
				}
			}
		},
	},
});

export const {
	fetchMessagesStart,
	fetchMessagesSuccess,
	fetchMessagesFailure,
	sendMessage,
	markAsRead,
} = messageSlice.actions;

export const selectMessages = (state: RootState, friendId: number) =>
	state.message.messages[friendId] || [];
export const selectMessageLoading = (state: RootState) => state.message.loading;
export const selectMessageError = (state: RootState) => state.message.error;

export default messageSlice.reducer;
