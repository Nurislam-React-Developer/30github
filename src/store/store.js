import { configureStore } from '@reduxjs/toolkit';
import frendSlice from './frendSlice';
import messagesSlice from './messageSlice';

export const store = configureStore({
	reducer: {
		[frendSlice.name]: frendSlice.reducer,
		[messagesSlice.name]: messagesSlice.reducer,
	},
})