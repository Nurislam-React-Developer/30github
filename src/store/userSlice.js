import { createSlice } from '@reduxjs/toolkit';

const loadUserFromStorage = () => {
	try {
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
	isAuthenticated: true, // For demo purposes, we'll assume user is always authenticated
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