import React, { useEffect } from 'react';

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
            avatar: 'https://via.placeholder.com/150',
          },
          image: 'https://via.placeholder.com/800x1200/3f51b5/ffffff?text=Привет!',
          text: 'Добро пожаловать в наше приложение!',
          timestamp: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Expires in 24 hours
        },
        {
          id: Date.now() + 1,
          user: {
            name: 'Система',
            avatar: 'https://via.placeholder.com/150/ff9800/ffffff?text=S',
          },
          image: 'https://via.placeholder.com/800x1200/ff9800/ffffff?text=Истории',
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