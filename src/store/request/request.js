import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.API_URL;

export const getFrends = createAsyncThunk(
  'request/getFrends',
  async (_, { rejectWithValue }) => {
    try {
      const {data} = await axios.get(`${API_URL}/friends`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
	}
);
