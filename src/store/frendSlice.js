import { createSlice } from '@reduxjs/toolkit';
import { getFrends } from './request/request';

// Получаем начальное состояние из localStorage
const loadFriendsFromStorage = () => {
	try {
		const savedFriends = localStorage.getItem('friends');
		return savedFriends ? JSON.parse(savedFriends) : [];
	} catch (error) {
		console.error('Error loading friends from localStorage:', error);
		return [];
	}
};

const initialState = {
	frends: [],
	isLoading: false,
	error: null,
	friendsList: loadFriendsFromStorage(), // Инициализируем пустым массивом
};

const frendSlice = createSlice({
	name: 'frend',
	initialState,
	reducers: {
		addFriend: (state, action) => {
			if (!state.friendsList) {
				state.friendsList = []; // Убедимся, что friendsList существует
			}
			const friendId = action.payload;
			if (!state.friendsList.includes(friendId)) {
				state.friendsList.push(friendId);
				localStorage.setItem('friends', JSON.stringify(state.friendsList));
			}
		},
		removeFriend: (state, action) => {
			if (!state.friendsList) {
				state.friendsList = []; // Убедимся, что friendsList существует
			}
			const friendId = action.payload;
			state.friendsList = state.friendsList.filter((id) => id !== friendId);
			localStorage.setItem('friends', JSON.stringify(state.friendsList));
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getFrends.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(getFrends.fulfilled, (state, action) => {
				state.isLoading = false;
				state.frends = action.payload;
				state.error = null;
			})
			.addCase(getFrends.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message;
			});
	},
});

export const { addFriend, removeFriend } = frendSlice.actions;
export default frendSlice
