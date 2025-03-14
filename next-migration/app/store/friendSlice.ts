'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface Friend {
	id: number;
	name: string;
	avatar: string;
	status?: string;
	lastSeen?: string;
	isOnline?: boolean;
}

interface FriendState {
	friends: Friend[];
	friendRequests: Friend[];
	loading: boolean;
	error: string | null;
}

const initialState: FriendState = {
	friends: [],
	friendRequests: [],
	loading: false,
	error: null,
};

const friendSlice = createSlice({
	name: 'friend',
	initialState,
	reducers: {
		fetchFriendsStart(state) {
			state.loading = true;
			state.error = null;
		},
		fetchFriendsSuccess(state, action: PayloadAction<Friend[]>) {
			state.friends = action.payload;
			state.loading = false;
		},
		fetchFriendsFailure(state, action: PayloadAction<string>) {
			state.loading = false;
			state.error = action.payload;
		},
		addFriend(state, action: PayloadAction<Friend>) {
			state.friends.push(action.payload);
		},
		removeFriend(state, action: PayloadAction<number>) {
			state.friends = state.friends.filter(
				(friend) => friend.id !== action.payload
			);
		},
		addFriendRequest(state, action: PayloadAction<Friend>) {
			state.friendRequests.push(action.payload);
		},
		removeFriendRequest(state, action: PayloadAction<number>) {
			state.friendRequests = state.friendRequests.filter(
				(request) => request.id !== action.payload
			);
		},
	},
});

export const {
	fetchFriendsStart,
	fetchFriendsSuccess,
	fetchFriendsFailure,
	addFriend,
	removeFriend,
	addFriendRequest,
	removeFriendRequest,
} = friendSlice.actions;

export const selectFriends = (state: RootState) => state.friend.friends;
export const selectFriendRequests = (state: RootState) =>
	state.friend.friendRequests;
export const selectFriendLoading = (state: RootState) => state.friend.loading;
export const selectFriendError = (state: RootState) => state.friend.error;

export default friendSlice.reducer;
