import { createSlice } from '@reduxjs/toolkit';
import { getFrends } from './request/request';

const initialState = {
  frends: [],
  isLoading: false,
  error: null,
};

export const frendSlice = createSlice({
  name: 'frend',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFrends.pending, (state) => {
      state.isLoading = true;
    })
    builder.addCase(getFrends.fulfilled, (state, action) => {
      state.isLoading = false;
      state.frends = action.payload; 
    })
    builder.addCase(getFrends.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
  }
})

