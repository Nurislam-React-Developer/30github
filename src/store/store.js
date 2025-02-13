import { configureStore } from '@reduxjs/toolkit';
import { frendSlice } from './frendSlice';

export const store = configureStore({
  reducer: {
    [frendSlice.name]: frendSlice.reducer,
  }
})