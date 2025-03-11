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
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/userSlice';

// Стилизованный Avatar с градиентной рамкой для непросмотренных историй в стиле Instagram
const StoryAvatar = styled(Avatar)(({ theme, viewed, darkMode }) => ({
  width: 60,
  height: 60,
  border: viewed 
    ? `2px solid ${darkMode ? '#333' : '#e0e0e0'}` 
    : 'none',
  cursor: 'pointer',
  transition: 'transform 0.2s',
  position: 'relative',
  zIndex: 1,
  '&::before': viewed ? {} : {
    content: '""',
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: '50%',
    background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
    zIndex: -1,
  },
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

// Контейнер для аватарки и имени пользователя в стиле Instagram
const StoryItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '0 4px',
  maxWidth: 64,
  padding: '0 2px',
}));

// Компонент для отображения одной истории в полноэкранном режиме
const StoryViewer = ({ story, onClose, darkMode }) => {
  // Поддержка нескольких изображений в одной истории
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  
  // Получаем массив изображений (для обратной совместимости)
  const images = Array.isArray(story.images) ? story.images : [story.image];
  
  // Сбрасываем прогресс при смене изображения
  useEffect(() => {
    setProgress(0);
  }, [currentImageIndex]);
  
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
  }, [currentImageIndex]);
  
  useEffect(() => {
    if (progress === 100) {
      // Если есть следующее изображение, переходим к нему
      if (currentImageIndex < images.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
      } else {
        // Если это последнее изображение, закрываем историю
        setTimeout(() => {
          onClose();
        }, 300);
      }
    }
  }, [progress, onClose, currentImageIndex, images.length]);
  
  return (
    <Dialog
      open={true}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          backgroundColor: 'black',
          color: '#fff',
          height: '90vh',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 2,
          margin: 0,
          padding: 0,
        }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        padding: '8px 8px 0 8px',
        gap: 1
      }}>
        {/* Progress bar segments like Instagram */}
        {images.map((_, index) => (
          <LinearProgress 
            key={index}
            variant="determinate" 
            value={index < currentImageIndex ? 100 : index === currentImageIndex ? progress : 0} 
            sx={{ 
              width: `${100 / images.length}%`,
              height: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#fff',
              }
            }} 
          />
        ))}
      </Box>
      
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
        width: '100%',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)',
        paddingTop: '16px',
        paddingBottom: '16px'
      }}>
        <Avatar 
          src={story.user.avatar} 
          sx={{ 
            mr: 1, 
            width: 36, 
            height: 36, 
            border: '2px solid #fff' 
          }} 
        />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              color: '#fff', 
              fontWeight: 600,
              fontSize: '0.85rem',
              lineHeight: 1.2
            }}
          >
            {story.user.name}
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'rgba(255,255,255,0.8)', 
              fontSize: '0.7rem' 
            }}
          >
            {new Date(story.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </Typography>
        </Box>
      </Box>
      
      <DialogContent sx={{ p: 0, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <Box 
          component="img"
          src={images[currentImageIndex]}
          alt="Story"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
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
              textShadow: '0 2px 4px rgba(0,0,0,0.8)',
              padding: '0 20px',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              letterSpacing: '0.5px'
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
  const currentUser = useSelector(selectCurrentUser);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [text, setText] = useState('');
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Ограничиваем количество изображений до 6
      const selectedFiles = files.slice(0, 6);
      
      Promise.all(
        selectedFiles.map((file) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result);
            };
            reader.readAsDataURL(file);
          });
        })
      ).then((previews) => {
        setImagePreviews(previews);
        setImages(selectedFiles);
        setCurrentPreviewIndex(0);
      });
    }
  };
  
  const handleSave = () => {
    if (imagePreviews.length === 0) {
      toast.error('Пожалуйста, добавьте хотя бы одно изображение для истории');
      return;
    }
    
    try {
      // Получение данных пользователя с приоритетом на Redux store
      const userName = currentUser?.name || 
                      localStorage.getItem('profileName') || 
                      JSON.parse(localStorage.getItem('user') || '{}')?.name || 
                      JSON.parse(localStorage.getItem('userSettings') || '{}')?.name || 'Пользователь';
      
      const userAvatar = currentUser?.avatar || 
                        localStorage.getItem('profileAvatar') || 
                        JSON.parse(localStorage.getItem('user') || '{}')?.avatar || 
                        'https://via.placeholder.com/150';
      
      // Сжатие всех изображений
      const compressImages = async () => {
        const compressedImages = [];
        
        for (let i = 0; i < imagePreviews.length; i++) {
          try {
            const preview = imagePreviews[i];
            const img = new Image();
            img.src = preview;
            
            // Ждем загрузки изображения
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
            });
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Установка максимальных размеров (уменьшены для экономии памяти)
            const maxWidth = 720; // Еще меньше для экономии памяти
            const maxHeight = 1080; // Еще меньше для экономии памяти
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
            
            // Получение сжатого изображения с более низким качеством (0.6 вместо 0.7)
            const compressedImage = canvas.toDataURL('image/jpeg', 0.6);
            compressedImages.push(compressedImage);
          } catch (error) {
            console.error(`Ошибка при сжатии изображения ${i}:`, error);
            // Если не удалось сжать, используем оригинал
            compressedImages.push(imagePreviews[i]);
          }
        }
        
        return compressedImages;
      };
      
      // Сжимаем изображения и создаем историю
      compressImages().then(compressedImages => {
        // Создание новой истории с массивом изображений
        const newStory = {
          id: Date.now(),
          user: {
            name: userName || 'Пользователь',
            avatar: userAvatar,
          },
          images: compressedImages, // Массив изображений вместо одного
          image: compressedImages[0], // Для обратной совместимости
          text: text,
          timestamp: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Истекает через 24 часа
        };
        
        // Сохранение истории с обработкой ошибок
        try {
          const stories = JSON.parse(localStorage.getItem('stories') || '[]');
          stories.unshift(newStory);
          localStorage.setItem('stories', JSON.stringify(stories));
          
          // Обновление UI
          onSave(newStory);
          onClose();
          
          // Уведомление
          toast.success(`История с ${compressedImages.length} фото успешно создана!`, {
            position: 'top-right',
            autoClose: 3000,
          });
        } catch (storageError) {
          console.error('Ошибка при сохранении истории:', storageError);
          
          // Попытка сохранить с еще более низким качеством
          try {
            // Еще сильнее сжимаем изображения
            const furtherCompressImages = async () => {
              const lowerQualityImages = [];
              
              for (let i = 0; i < compressedImages.length; i++) {
                try {
                  const img = new Image();
                  img.src = compressedImages[i];
                  
                  await new Promise((resolve) => {
                    img.onload = resolve;
                  });
                  
                  const canvas = document.createElement('canvas');
                  const ctx = canvas.getContext('2d');
                  
                  // Еще меньшие размеры
                  const maxWidth = 540;
                  const maxHeight = 960;
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
                  
                  // Еще более низкое качество
                  const lowerQualityImage = canvas.toDataURL('image/jpeg', 0.4);
                  lowerQualityImages.push(lowerQualityImage);
                } catch (error) {
                  console.error(`Ошибка при повторном сжатии изображения ${i}:`, error);
                  lowerQualityImages.push(compressedImages[i]);
                }
              }
              
              return lowerQualityImages;
            };
            
            furtherCompressImages().then(lowerQualityImages => {
              newStory.images = lowerQualityImages;
              newStory.image = lowerQualityImages[0];
              
              const stories = JSON.parse(localStorage.getItem('stories') || '[]');
              
              // Если хранилище переполнено, удаляем старые истории
              if (stories.length > 5) {
                stories.splice(5); // Оставляем только 5 последних историй
              }
              
              stories.unshift(newStory);
              localStorage.setItem('stories', JSON.stringify(stories));
              
              // Обновление UI
              onSave(newStory);
              onClose();
              
              toast.success('История создана с пониженным качеством изображений', {
                position: 'top-right',
                autoClose: 3000,
              });
            });
          } catch (finalError) {
            toast.error('Не удалось сохранить историю. Попробуйте изображения меньшего размера', {
              position: 'top-right',
              autoClose: 3000,
            });
          }
        }
      }).catch(error => {
        console.error('Ошибка при обработке изображений:', error);
        toast.error('Ошибка при обработке изображений. Попробуйте другие изображения', {
          position: 'top-right',
          autoClose: 3000,
        });
      });
    } catch (error) {
      console.error('Ошибка при создании истории:', error);
      toast.error('Произошла ошибка при создании истории', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
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
          {imagePreviews.length > 0 ? (
            <Box sx={{ position: 'relative', width: '100%' }}>
              <Box 
                component="img"
                src={imagePreviews[currentPreviewIndex]}
                alt="Preview"
                sx={{
                  width: '100%',
                  maxHeight: '300px',
                  objectFit: 'contain',
                  borderRadius: 1,
                }}
              />
              {imagePreviews.length > 1 && (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mt: 1, 
                  gap: 1 
                }}>
                  {imagePreviews.map((_, index) => (
                    <Box 
                      key={index}
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: index === currentPreviewIndex ? 
                          (darkMode ? '#bb86fc' : '#3f51b5') : 
                          (darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'),
                        cursor: 'pointer'
                      }}
                      onClick={() => setCurrentPreviewIndex(index)}
                    />
                  ))}
                </Box>
              )}
              {imagePreviews.length > 1 && (
                <>
                  <IconButton 
                    sx={{
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      color: '#fff',
                      '&:hover': { backgroundColor: 'rgba(0,0,0,0.5)' },
                      display: currentPreviewIndex > 0 ? 'flex' : 'none'
                    }}
                    onClick={() => setCurrentPreviewIndex(prev => Math.max(0, prev - 1))}
                  >
                    <Box component="span" sx={{ fontSize: '1.5rem' }}>&lt;</Box>
                  </IconButton>
                  <IconButton 
                    sx={{
                      position: 'absolute',
                      right: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      color: '#fff',
                      '&:hover': { backgroundColor: 'rgba(0,0,0,0.5)' },
                      display: currentPreviewIndex < imagePreviews.length - 1 ? 'flex' : 'none'
                    }}
                    onClick={() => setCurrentPreviewIndex(prev => Math.min(imagePreviews.length - 1, prev + 1))}
                  >
                    <Box component="span" sx={{ fontSize: '1.5rem' }}>&gt;</Box>
                  </IconButton>
                </>
              )}
              <Typography variant="caption" sx={{ 
                display: 'block', 
                textAlign: 'center', 
                mt: 1, 
                color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' 
              }}>
                {imagePreviews.length} фото {currentPreviewIndex + 1}/{imagePreviews.length}
              </Typography>
            </Box>
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
                multiple
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
            width: 60,
            height: 60,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: darkMode ? '#333' : '#f5f5f5',
            cursor: 'pointer',
            position: 'relative',
            border: `2px solid ${darkMode ? '#333' : '#e0e0e0'}`,
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