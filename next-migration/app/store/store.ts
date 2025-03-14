'use client';

import { configureStore } from '@reduxjs/toolkit';
import friendReducer from './friendSlice';
import messageReducer from './messageSlice';
import userReducer from './userSlice';

export const store = configureStore({
	reducer: {
		user: userReducer,
		friend: friendReducer,
		message: messageReducer,
		// Add other reducers as they are migrated
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
