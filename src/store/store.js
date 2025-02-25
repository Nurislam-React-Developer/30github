import { configureStore } from '@reduxjs/toolkit';
import frendSlice from './frendSlice';
import messagesSlice from './messageSlice';
import userSlice from './userSlice';

export const store = configureStore({
	reducer: {
		[frendSlice.name]: frendSlice.reducer,
		[messagesSlice.name]: messagesSlice.reducer,
		[userSlice.name]: userSlice.reducer,
	},
})