import { useEffect } from 'react';

const InitializeStories = () => {
	useEffect(() => {
		// Check if stories already exist in localStorage
		const existingStories = JSON.parse(localStorage.getItem('stories') || '[]');

		// Only initialize if no stories exist
		if (existingStories.length === 0) {
			// Create sample stories
			const sampleStories = [
				{
					id: Date.now(),
					user: {
						name: 'Демо пользователь',
						avatar: '/logo.png',
					},
					image: '/sunsetBackground.png',
					text: 'Добро пожаловать в наше приложение!',
					timestamp: new Date().toISOString(),
					expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Expires in 24 hours
				},
				{
					id: Date.now() + 1,
					user: {
						name: 'Система',
						avatar: '/logo.png',
					},
					image: '/oceanBackground.png',
					text: 'Нажмите на + чтобы создать свою историю!',
					timestamp: new Date().toISOString(),
					expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Expires in 24 hours
				},
			];

			// Save to localStorage
			localStorage.setItem('stories', JSON.stringify(sampleStories));
		}
	}, []);

	// This component doesn't render anything
	return null;
};

export default InitializeStories;
