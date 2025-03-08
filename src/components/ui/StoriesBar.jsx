import React, { useState, useEffect } from 'react';
import {
  Box,
  Avatar,
  Typography,
  Dialog,
  IconButton,
  DialogContent,
  LinearProgress,
  Button,
  TextField,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';

// Стилизованный Avatar с цветной рамкой для непросмотренных историй
const StoryAvatar = styled(Avatar)(({ theme, viewed, darkMode }) => ({
  width: 60,
  height: 60,
  border: viewed 
    ? `2px solid ${darkMode ? '#333' : '#e0e0e0'}` 
    : `2px solid ${darkMode ? '#bb86fc' : '#3f51b5'}`,
  cursor: 'pointer',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

// Контейнер для аватарки и имени пользователя
const StoryItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '0 8px',
  maxWidth: 70,
}));

// Компонент для отображения одной истории в полноэкранном режиме
const StoryViewer = ({ story, onClose, darkMode }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 50); // 5 секунд на просмотр истории (50ms * 100)
    
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        onClose();
      }, 300);
    }
  }, [progress, onClose]);
  
  return (
    <Dialog
      open={true}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          backgroundColor: darkMode ? '#121212' : '#fff',
          color: darkMode ? '#fff' : '#000',
          height: '80vh',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 2,
        }
      }}
    >
      <LinearProgress 
        variant="determinate" 
        value={progress} 
        sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0,
          height: 4,
          backgroundColor: darkMode ? '#333' : '#e0e0e0',
          '& .MuiLinearProgress-bar': {
            backgroundColor: darkMode ? '#bb86fc' : '#3f51b5',
          }
        }} 
      />
      
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          color: '#fff',
          zIndex: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }
        }}
      >
        <CloseIcon />
      </IconButton>
      
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        p: 2, 
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 5,
      }}>
        <Avatar src={story.user.avatar} sx={{ mr: 1 }} />
        <Typography variant="subtitle1" color={darkMode ? '#fff' : '#000'}>
          {story.user.name}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
          {new Date(story.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </Typography>
      </Box>
      
      <DialogContent sx={{ p: 0, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box 
          component="img"
          src={story.image}
          alt="Story"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
        
        {story.text && (
          <Typography 
            variant="h6" 
            sx={{ 
              position: 'absolute', 
              bottom: 40, 
              left: 0, 
              right: 0, 
              textAlign: 'center', 
              color: '#fff',
              textShadow: '0 1px 2px rgba(0,0,0,0.8)',
              padding: '0 20px',
              fontWeight: 'bold',
            }}
          >
            {story.text}
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Компонент для создания новой истории
const CreateStoryDialog = ({ open, onClose, onSave, darkMode }) => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [text, setText] = useState('');
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImage(file);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSave = () => {
    if (!imagePreview) {
      toast.error('Пожалуйста, добавьте изображение для истории');
      return;
    }
    
    // Сжатие изображения
    const img = new Image();
    img.src = imagePreview;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Установка максимальных размеров
      const maxWidth = 800;
      const maxHeight = 1200;
      let width = img.width;
      let height = img.height;
      
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      
      // Получение сжатого изображения
      const compressedImage = canvas.toDataURL('image/jpeg', 0.7);
      
      // Получение данных пользователя
      const userData = JSON.parse(localStorage.getItem('user')) || {};
      const userName = userData.name || localStorage.getItem('profileName') || 'Anonymous';
      const userAvatar = userData.avatar || localStorage.getItem('profileAvatar') || 'https://via.placeholder.com/150';
      
      // Создание новой истории
      const newStory = {
        id: Date.now(),
        user: {
          name: userName,
          avatar: userAvatar,
        },
        image: compressedImage,
        text: text,
        timestamp: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Истекает через 24 часа
      };
      
      // Сохранение истории
      const stories = JSON.parse(localStorage.getItem('stories') || '[]');
      stories.unshift(newStory);
      localStorage.setItem('stories', JSON.stringify(stories));
      
      // Обновление UI
      onSave(newStory);
      onClose();
      
      // Уведомление
      toast.success('История успешно создана!', {
        position: 'top-right',
        autoClose: 3000,
      });
    };
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          backgroundColor: darkMode ? '#1e1e1e' : '#fff',
          color: darkMode ? '#fff' : '#000',
          borderRadius: 2,
          p: 2,
        }
      }}
    >
      <DialogContent>
        <Typography variant="h6" gutterBottom align="center">
          Создать историю
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
          {imagePreview ? (
            <Box 
              component="img"
              src={imagePreview}
              alt="Preview"
              sx={{
                width: '100%',
                maxHeight: '300px',
                objectFit: 'contain',
                borderRadius: 1,
              }}
            />
          ) : (
            <Box 
              sx={{
                width: '100%',
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: darkMode ? '#333' : '#f5f5f5',
                borderRadius: 1,
                cursor: 'pointer',
              }}
              component={motion.div}
              whileHover={{ scale: 1.02 }}
              onClick={() => document.getElementById('story-image-input').click()}
            >
              <Typography variant="body1" color="text.secondary">
                Нажмите, чтобы добавить изображение
              </Typography>
              <input
                type="file"
                id="story-image-input"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
            </Box>
          )}
          
          <TextField
            fullWidth
            label="Добавить текст к истории (необязательно)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            multiline
            rows={2}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: darkMode ? '#bb86fc' : '#3f51b5',
                },
                '&.Mui-focused fieldset': {
                  borderColor: darkMode ? '#bb86fc' : '#3f51b5',
                },
              },
              '& .MuiInputLabel-root': {
                color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
              },
              '& .MuiInputBase-input': {
                color: darkMode ? '#fff' : '#000',
              },
            }}
          />
          
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button 
              variant="outlined" 
              onClick={onClose}
              sx={{
                color: darkMode ? '#fff' : '#000',
                borderColor: darkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
              }}
            >
              Отмена
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSave}
              disabled={!imagePreview}
              sx={{
                backgroundColor: darkMode ? '#bb86fc' : '#3f51b5',
                '&:hover': {
                  backgroundColor: darkMode ? '#9c27b0' : '#303f9f',
                },
              }}
            >
              Опубликовать
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

const StoriesBar = ({ darkMode }) => {
  const [stories, setStories] = useState([]);
  const [viewedStories, setViewedStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  // Загрузка историй и просмотренных историй из localStorage
  useEffect(() => {
    const loadedStories = JSON.parse(localStorage.getItem('stories') || '[]');
    const loadedViewedStories = JSON.parse(localStorage.getItem('viewedStories') || '[]');
    
    // Фильтрация историй, которые не истекли (24 часа)
    const validStories = loadedStories.filter(story => {
      const expiryTime = new Date(story.expiresAt).getTime();
      return expiryTime > Date.now();
    });
    
    // Если есть истории, которые истекли, обновляем localStorage
    if (validStories.length !== loadedStories.length) {
      localStorage.setItem('stories', JSON.stringify(validStories));
    }
    
    setStories(validStories);
    setViewedStories(loadedViewedStories);
  }, []);
  
  // Обработчик просмотра истории
  const handleViewStory = (story) => {
    setSelectedStory(story);
    
    // Добавление истории в просмотренные
    if (!viewedStories.includes(story.id)) {
      const updatedViewedStories = [...viewedStories, story.id];
      setViewedStories(updatedViewedStories);
      localStorage.setItem('viewedStories', JSON.stringify(updatedViewedStories));
    }
  };
  
  // Закрытие просмотра истории
  const handleCloseStory = () => {
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
  
  // Если нет историй, не отображаем компонент
  if (stories.length === 0 && !createDialogOpen) {
    return null;
  }
  
  return (
    <Box
      sx={{
        display: 'flex',
        overflowX: 'auto',
        p: 2,
        mb: 2,
        backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        '&::-webkit-scrollbar': {
          height: '6px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: darkMode ? '#333' : '#f1f1f1',
          borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: darkMode ? '#bb86fc' : '#3f51b5',
          borderRadius: '10px',
        },
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
            width: 60,
            height: 60,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: darkMode ? '#333' : '#f5f5f5',
            cursor: 'pointer',
            border: `2px dashed ${darkMode ? '#bb86fc' : '#3f51b5'}`,
          }}
          component={motion.div}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleOpenCreateDialog}
        >
          <AddIcon sx={{ color: darkMode ? '#bb86fc' : '#3f51b5' }} />
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