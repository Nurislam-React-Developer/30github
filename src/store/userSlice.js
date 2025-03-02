import { createSlice } from '@reduxjs/toolkit';

const loadUserFromStorage = () => {
	try {
		// First try to get user from 'user' key (used by auth system)
		const authUser = localStorage.getItem('user');
		if (authUser) {
			return JSON.parse(authUser);
		}
		
		// Fallback to 'currentUser' for backward compatibility
		const savedUser = localStorage.getItem('currentUser');
		return savedUser ? JSON.parse(savedUser) : {
			id: 1,
			name: 'Нурислам Абдималиков',
			avatar: 'https://i.pravatar.cc/150?img=3',
			email: 'nurislam@example.com',
			bio: 'Frontend Developer'
		};
	} catch (error) {
		console.error('Error loading user:', error);
		return null;
	}
};

const initialState = {
	currentUser: loadUserFromStorage(),
	isAuthenticated: !!localStorage.getItem('token'), // Check if token exists to determine authentication status
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		updateProfile: (state, action) => {
			state.currentUser = { ...state.currentUser, ...action.payload };
			localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
		},
		logout: (state) => {
			state.currentUser = null;
			state.isAuthenticated = false;
			localStorage.removeItem('currentUser');
		},
	},
});

export const { updateProfile, logout } = userSlice.actions;
export const selectCurrentUser = (state) => state.user.currentUser;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;

export default userSlice;