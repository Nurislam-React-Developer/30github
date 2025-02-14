import { createSlice } from '@reduxjs/toolkit';
import { getFrends } from './request/request';

const initialState = {
	frends: [],
	isLoading: false,
	error: null,
};

const frendSlice = createSlice({
	name: 'frend',
	initialState,
	reducers: {
		addFriend: (state, action) => {
			const friendId = action.payload;
			const friend = state.frends.find((f) => f.id === friendId);
			if (friend) {
				friend.isFriend = true;
			}
		},
		removeFriend: (state, action) => {
			const friendId = action.payload;
			const friend = state.frends.find((f) => f.id === friendId);
			if (friend) {
				friend.isFriend = false;
			}
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getFrends.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getFrends.fulfilled, (state, action) => {
				state.isLoading = false;
				state.frends = action.payload.map((friend) => ({
					...friend,
					isFriend: false, // добавляем поле isFriend
				}));
			})
			.addCase(getFrends.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message;
			});
	},
});

export const { addFriend, removeFriend } = frendSlice.actions;
export default frendSlice
