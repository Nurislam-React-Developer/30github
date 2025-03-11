import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';
import { motion } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../store/userSlice';
import { StoriesManager, cleanupStorage, getStorageUsagePercentage } from '../../../utils/storageUtils';
import StoryViewer from './StoryViewer';
import CreateStoryDialog from './CreateStoryDialog';
import { StoryAvatar, StoryItem } from './StyledComponents';

const StoriesBar = ({ darkMode }) => {
  const [stories, setStories] = useState([]);
  const [viewedStories, setViewedStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  // Загрузка историй и просмотренных историй из localStorage с использованием StoriesManager
  useEffect(() => {
    try {
      // Удаляем истории с истекшим сроком действия
      const removedCount = StoriesManager.removeExpiredStories();
      if (removedCount > 0) {
        console.log(`Удалено ${removedCount} историй с истекшим сроком действия`);
      }
      
      // Очищаем просмотренные истории, которые больше не существуют
      StoriesManager.cleanupViewedStories();
      
      // Получаем актуальные истории и просмотренные истории
      const validStories = StoriesManager.getStories();
      const validViewedStories = StoriesManager.getViewedStories();
      
      // Проверяем использование хранилища
      const usagePercentage = getStorageUsagePercentage();
      console.log(`Использование localStorage: ${usagePercentage.toFixed(2)}%`);
      
      // Если хранилище заполнено более чем на 80%, выполняем очистку
      if (usagePercentage > 80) {
        cleanupStorage({
          keysToPreserve: ['user', 'userSettings', 'profileName', 'profileAvatar'],
          targetPercentage: 70
        });
        console.log('Выполнена очистка localStorage для освобождения места');
      }
      
      setStories(validStories);
      setViewedStories(validViewedStories);
    } catch (error) {
      console.error('Ошибка при загрузке историй:', error);
      // В случае ошибки, пробуем очистить хранилище историй
      try {
        localStorage.removeItem('stories');
        localStorage.removeItem('viewedStories');
        setStories([]);
        setViewedStories([]);
        toast.error('Произошла ошибка при загрузке историй. Хранилище очищено.', {
          position: 'top-right',
          autoClose: 3000,
        });
      } catch (clearError) {
        console.error('Не удалось очистить хранилище:', clearError);
      }
    }
  }, []);
  
  // Обработчик просмотра истории
  const handleViewStory = (story) => {
    setSelectedStory(story);
    
    // Добавление истории в просмотренные с использованием StoriesManager
    if (!viewedStories.includes(story.id)) {
      const updatedViewedStories = [...viewedStories, story.id];
      setViewedStories(updatedViewedStories);
      // Используем StoriesManager для безопасного сохранения просмотренных историй
      StoriesManager.markAsViewed(story.id);
    }
  };
  
  // Закрытие просмотра истории
  const handleCloseStory = async () => {
    setSelectedStory(null);
  };
  
  // Открытие диалога создания истории
  const handleOpenCreateDialog = () => {
    setCreateDialogOpen(true);
  };
  
  // Закрытие диалога создания истории
  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
  };
  
  // Добавление новой истории
  const handleAddStory = (newStory) => {
    setStories([newStory, ...stories]);
  };
  
  // Удаляем условие, которое скрывает компонент, если нет историй
  // if (stories.length === 0 && !createDialogOpen) {
  //   return null;
  // }
  
  return (
    <Box
      sx={{
        display: 'flex',
        overflowX: 'auto',
        p: 2,
        mb: 2,
        backgroundColor: 'transparent',
        borderRadius: 0,
        boxShadow: 'none',
        position: 'relative',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        paddingBottom: '16px',
        marginBottom: '16px',
        gap: 2
      }}
      component={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Кнопка добавления истории */}
      <StoryItem>
        <Box
          sx={{
            width: 62,
            height: 62,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: darkMode ? '#333' : '#f5f5f5',
            cursor: 'pointer',
            position: 'relative',
            border: `2px dashed ${darkMode ? '#bb86fc' : '#3f51b5'}`,
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: darkMode ? '#bb86fc' : '#3f51b5',
              zIndex: 0
            }
          }}
          component={motion.div}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleOpenCreateDialog}
        >
          <AddIcon sx={{ color: '#fff', zIndex: 1, fontSize: '16px' }} />
        </Box>
        <Typography
          variant="caption"
          align="center"
          sx={{
            mt: 1,
            color: darkMode ? '#fff' : '#000',
            width: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: '0.7rem',
            fontWeight: 500
          }}
        >
          Создать
        </Typography>
      </StoryItem>
      
      {/* Список историй */}
      {stories.map((story) => {
        const isViewed = viewedStories.includes(story.id);
        return (
          <StoryItem key={story.id}>
            <StoryAvatar
              src={story.user.avatar}
              viewed={isViewed}
              darkMode={darkMode}
              component={motion.div}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleViewStory(story)}
            />
            <Typography
              variant="caption"
              align="center"
              sx={{
                mt: 1,
                color: darkMode ? '#fff' : '#000',
                width: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {story.user.name}
            </Typography>
          </StoryItem>
        );
      })}
      
      {/* Просмотр истории */}
      {selectedStory && (
        <StoryViewer
          story={selectedStory}
          onClose={handleCloseStory}
          darkMode={darkMode}
        />
      )}
      
      {/* Диалог создания истории */}
      <CreateStoryDialog
        open={createDialogOpen}
        onClose={handleCloseCreateDialog}
        onSave={handleAddStory}
        darkMode={darkMode}
      />
    </Box>
  );
};

export default StoriesBar;