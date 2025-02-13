import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getFrends = createAsyncThunk(
	'request/getFrends',
	async (_, { rejectWithValue }) => {
		try {
			console.log('API URL:', `${API_URL}/friends`);
			const { data } = await axios.get(`${API_URL}/friends`);
			console.log('Полученные данные:', data);
			return data;
		} catch (error) {
			console.error('Ошибка запроса:', error);
			return rejectWithValue(
				error.response?.data || 'Произошла ошибка при загрузке данных'
			);
		}
	}
);
