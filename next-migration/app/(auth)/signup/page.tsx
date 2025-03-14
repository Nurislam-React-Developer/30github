'use client';

import { login } from '../../store/userSlice';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

export default function SignUp() {
	const router = useRouter();
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm();

	const password = watch('password');

	const onSubmit = async (data) => {
		try {
			setIsLoading(true);
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Mock user creation
			const newUser = {
				id: 1,
				name: data.name,
				email: data.email,
				avatar: 'https://i.pravatar.cc/150?img=3',
				bio: 'Новый пользователь',
			};

			// Store user data
			localStorage.setItem('user', JSON.stringify(newUser));
			localStorage.setItem('token', 'mock-jwt-token');

			// Update Redux state
			dispatch(login(newUser));

			toast.success('Регистрация успешна!');
			router.push('/');
		} catch (error) {
			console.error('Registration error:', error);
			toast.error('Ошибка регистрации. Пожалуйста, попробуйте снова.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-900 dark:to-gray-800 p-4'>
			<div className='w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800'>
				<div className='mb-6 text-center'>
					<h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
						Регистрация
					</h1>
					<p className='mt-2 text-gray-600 dark:text-gray-300'>
						Создайте новый аккаунт
					</p>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
					<div>
						<label
							htmlFor='name'
							className='block text-sm font-medium text-gray-700 dark:text-gray-300'
						>
							Имя
						</label>
						<input
							id='name'
							type='text'
							{...register('name', { required: 'Имя обязательно' })}
							className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
						/>
						{errors.name && (
							<p className='mt-1 text-sm text-red-600'>{errors.name.message}</p>
						)}
					</div>

					<div>
						<label
							htmlFor='email'
							className='block text-sm font-medium text-gray-700 dark:text-gray-300'
						>
							Email
						</label>
						<input
							id='email'
							type='email'
							{...register('email', {
								required: 'Email обязателен',
								pattern: {
									value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
									message: 'Неверный формат email',
								},
							})}
							className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
						/>
						{errors.email && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.email.message}
							</p>
						)}
					</div>

					<div>
						<label
							htmlFor='password'
							className='block text-sm font-medium text-gray-700 dark:text-gray-300'
						>
							Пароль
						</label>
						<input
							id='password'
							type='password'
							{...register('password', {
								required: 'Пароль обязателен',
								minLength: {
									value: 6,
									message: 'Пароль должен содержать минимум 6 символов',
								},
							})}
							className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
						/>
						{errors.password && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.password.message}
							</p>
						)}
					</div>

					<div>
						<label
							htmlFor='confirmPassword'
							className='block text-sm font-medium text-gray-700 dark:text-gray-300'
						>
							Подтвердите пароль
						</label>
						<input
							id='confirmPassword'
							type='password'
							{...register('confirmPassword', {
								required: 'Подтвердите пароль',
								validate: (value) =>
									value === password || 'Пароли не совпадают',
							})}
							className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
						/>
						{errors.confirmPassword && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.confirmPassword.message}
							</p>
						)}
					</div>

					<div>
						<button
							type='submit'
							disabled={isLoading}
							className='flex w-full justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600'
						>
							{isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
						</button>
					</div>
				</form>

				<div className='mt-6 text-center'>
					<p className='text-sm text-gray-600 dark:text-gray-300'>
						Уже есть аккаунт?{' '}
						<Link
							href='/signin'
							className='font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400'
						>
							Войти
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
