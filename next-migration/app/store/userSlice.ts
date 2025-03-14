'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface User {
	id: number;
	name: string;
	avatar: string;
	email: string;
	bio: string;
}

interface UserState {
	currentUser: User | null;
	isAuthenticated: boolean;
}

const loadUserFromStorage = (): User | null => {
	if (typeof window === 'undefined') {
		return null; // Return null during server-side rendering
	}

	try {
		const userData = localStorage.getItem('user');
		if (userData) {
			return JSON.parse(userData);
		}

		// Fallback to 'currentUser' for backward compatibility
		const savedUser = localStorage.getItem('currentUser');
		return savedUser
			? JSON.parse(savedUser)
			: {
					id: 1,
					name: 'Нурислам Абдималиков',
					avatar: 'https://i.pravatar.cc/150?img=3',
					email: 'nurislam@example.com',
					bio: 'Frontend Developer',
			  };
	} catch (error) {
		console.error('Error loading user:', error);
		return null;
	}
};

const initialState: UserState = {
	currentUser: null, // Will be set in a useEffect after component mount
	isAuthenticated: false, // Will be set in a useEffect after component mount
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		initUser: (state) => {
			if (typeof window !== 'undefined') {
				state.currentUser = loadUserFromStorage();
				state.isAuthenticated = !!localStorage.getItem('token');
			}
		},
		updateProfile: (state, action: PayloadAction<Partial<User>>) => {
			if (state.currentUser) {
				state.currentUser = { ...state.currentUser, ...action.payload };
				try {
					localStorage.setItem(
						'currentUser',
						JSON.stringify(state.currentUser)
					);
					localStorage.setItem('user', JSON.stringify(state.currentUser));
				} catch (error) {
					console.error('Error updating user profile:', error);
				}
			}
		},
		logout: (state) => {
			state.currentUser = null;
			state.isAuthenticated = false;
			if (typeof window !== 'undefined') {
				localStorage.removeItem('currentUser');
				localStorage.removeItem('user');
				localStorage.removeItem('token');
			}
		},
	},
});

export const { initUser, updateProfile, logout } = userSlice.actions;
export const selectCurrentUser = (state: RootState) => state.user.currentUser;
export const selectIsAuthenticated = (state: RootState) =>
	state.user.isAuthenticated;

export default userSlice.reducer;
