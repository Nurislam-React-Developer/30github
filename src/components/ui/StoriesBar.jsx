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
import { compressImage, StoriesManager, cleanupStorage, getStorageUsagePercentage } from '../../utils/storageUtils';

// Стилизованный Avatar с градиентной рамкой для непросмотренных историй в стиле Instagram
const StoryAvatar = styled(Avatar)(({ theme, viewed, darkMode }) => ({
  width: 62,
  height: 62,
  border: viewed 
    ? `2px solid ${darkMode ? '#333' : '#e0e0e0'}` 
    : '2px solid transparent',
  cursor: 'pointer',
  transition: 'transform 0.2s',
  position: 'relative',
  zIndex: 1,
  '&::before': viewed ? {} : {
    content: '""',
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: '50%',
    background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
    zIndex: -1,
    animation: 'rotate 1.5s linear infinite',
  },
  '&:hover': {
    transform: 'scale(1.05)',
  },
  '@keyframes rotate': {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '100%': {
      transform: 'rotate(360deg)',
    },
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
  
  // Обработчики для свайпа (как в Instagram)
  const handleTouchStart = (e) => {
    const touchDown = e.touches[0].clientX;
    document.touchStartX = touchDown;
  };
  
  const handleTouchMove = (e) => {
    if (!document.touchStartX) return;
    
    const touchDown = document.touchStartX;
    const currentTouch = e.touches[0].clientX;
    const diff = touchDown - currentTouch;
    
    // Если свайп достаточно длинный
    if (diff > 50) { // свайп влево - следующее изображение
      if (currentImageIndex < images.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
      } else {
        onClose(); // закрыть историю, если это последнее изображение
      }
      document.touchStartX = null;
    }
    
    if (diff < -50) { // свайп вправо - предыдущее изображение
      if (currentImageIndex > 0) {
        setCurrentImageIndex(currentImageIndex - 1);
      }
      document.touchStartX = null;
    }
  };
  
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
      
      <DialogContent 
        sx={{ p: 0, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
        onClick={(e) => {
          // Добавляем навигацию по клику для мобильных устройств
          const { clientX } = e;
          const { left, width } = e.currentTarget.getBoundingClientRect();
          const clickPosition = clientX - left;
          
          // Если клик в левой трети экрана - предыдущее изображение
          if (clickPosition < width / 3 && currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
          }
          // Если клик в правой трети экрана - следующее изображение
          else if (clickPosition > (width * 2) / 3 && currentImageIndex < images.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
          }
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
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
        
        {/* Индикаторы навигации для мобильных устройств */}
        {images.length > 1 && (
          <>
            {/* Индикаторы изображений в стиле Instagram */}
            <Box sx={{
              position: 'absolute',
              top: 60,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              gap: '4px',
              padding: '0 16px',
              zIndex: 10
            }}>
              {images.map((_, idx) => (
                <Box 
                  key={idx}
                  sx={{
                    height: '4px',
                    flex: 1,
                    backgroundColor: idx === currentImageIndex ? '#fff' : 'rgba(255,255,255,0.5)',
                    borderRadius: '2px',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </Box>
            
            {/* Левая область для навигации назад */}
            <Box 
              sx={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '33%',
                height: '100%',
                cursor: currentImageIndex > 0 ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                padding: '0 16px',
                opacity: 0
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (currentImageIndex > 0) {
                  setCurrentImageIndex(currentImageIndex - 1);
                }
              }}
            />
            
            {/* Правая область для навигации вперед */}
            <Box 
              sx={{
                position: 'absolute',
                right: 0,
                top: 0,
                width: '33%',
                height: '100%',
                cursor: currentImageIndex < images.length - 1 ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                padding: '0 16px',
                opacity: 0
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (currentImageIndex < images.length - 1) {
                  setCurrentImageIndex(currentImageIndex + 1);
                }
              }}
            />
            
            {/* Индикатор текущего изображения */}
            <Typography 
              variant="caption" 
              sx={{ 
                position: 'absolute', 
                bottom: 16, 
                right: 16, 
                backgroundColor: 'rgba(0,0,0,0.5)', 
                color: '#fff', 
                padding: '4px 8px', 
                borderRadius: 4,
                fontSize: '0.7rem'
              }}
            >
              {currentImageIndex + 1}/{images.length}
            </Typography>
          </>
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
                        '/logo.png';
      
      // Функция для проверки размера localStorage и очистки при необходимости
      const checkAndCleanStorage = () => {
        try {
          // Получаем текущие истории
          const currentStories = JSON.parse(localStorage.getItem('stories') || '[]');
          
          // Если историй больше 10, удаляем самые старые
          if (currentStories.length > 10) {
            // Оставляем только 10 последних историй
            const trimmedStories = currentStories.slice(0, 10);
            localStorage.setItem('stories', JSON.stringify(trimmedStories));
          }
          
          // Проверяем общий размер localStorage
          let totalSize = 0;
          for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
              totalSize += localStorage[key].length * 2; // Умножаем на 2, т.к. каждый символ занимает 2 байта
            }
          }
          
          // Если размер близок к лимиту (4.5MB из 5MB), очищаем старые истории
          const limitInBytes = 4.5 * 1024 * 1024; // 4.5MB
          if (totalSize > limitInBytes && currentStories.length > 0) {
            // Удаляем половину старых историй
            const halfLength = Math.max(1, Math.floor(currentStories.length / 2));
            const reducedStories = currentStories.slice(0, halfLength);
            localStorage.setItem('stories', JSON.stringify(reducedStories));
          }
          
          return true;
        } catch (error) {
          console.error('Ошибка при проверке хранилища:', error);
          return false;
        }
      };
      
      // Сжатие всех изображений с адаптивным качеством
      const compressImages = async () => {
        // Сначала проверяем и очищаем хранилище
        checkAndCleanStorage();
        
        const compressedImages = [];
        // Определяем начальное качество сжатия в зависимости от количества изображений
        let quality = imagePreviews.length > 3 ? 0.5 : 0.6;
        // Уменьшаем размеры для большего количества изображений
        const maxWidth = imagePreviews.length > 3 ? 540 : 720;
        const maxHeight = imagePreviews.length > 3 ? 960 : 1080;
        
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
            
            // Расчет размеров с учетом соотношения сторон
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
            
            // Получение сжатого изображения с адаптивным качеством
            const compressedImage = canvas.toDataURL('image/jpeg', quality);
            compressedImages.push(compressedImage);
          } catch (error) {
            console.error(`Ошибка при сжатии изображения ${i}:`, error);
            // Если не удалось сжать, пробуем с еще более низким качеством
            try {
              const preview = imagePreviews[i];
              const img = new Image();
              img.src = preview;
              
              await new Promise((resolve) => {
                img.onload = resolve;
              });
              
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              
              // Еще меньшие размеры для аварийного сжатия
              const emergencyMaxWidth = 400;
              const emergencyMaxHeight = 800;
              let width = img.width;
              let height = img.height;
              
              if (width > height) {
                if (width > emergencyMaxWidth) {
                  height *= emergencyMaxWidth / width;
                  width = emergencyMaxWidth;
                }
              } else {
                if (height > emergencyMaxHeight) {
                  width *= emergencyMaxHeight / height;
                  height = emergencyMaxHeight;
                }
              }
              
              canvas.width = width;
              canvas.height = height;
              ctx.drawImage(img, 0, 0, width, height);
              
              // Экстремально низкое качество для аварийного случая
              const emergencyCompressedImage = canvas.toDataURL('image/jpeg', 0.3);
              compressedImages.push(emergencyCompressedImage);
            } catch (finalError) {
              console.error(`Критическая ошибка при сжатии изображения ${i}:`, finalError);
              // В крайнем случае пропускаем это изображение
              // Не добавляем оригинал, так как он может быть слишком большим
            }
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
        
        // Функция для безопасного сохранения в localStorage с проверкой размера
        const safelyStoreStories = async (storiesToSave, currentStory, compressionLevel = 1) => {
          try {
            // Пробуем сохранить истории
            localStorage.setItem('stories', JSON.stringify(storiesToSave));
            
            // Если успешно, обновляем UI
            onSave(currentStory);
            onClose();
            
            // Уведомление в зависимости от уровня сжатия
            if (compressionLevel === 1) {
              toast.success(`История с ${currentStory.images.length} фото успешно создана!`, {
                position: 'top-right',
                autoClose: 3000,
              });
            } else {
              toast.success('История создана с пониженным качеством изображений', {
                position: 'top-right',
                autoClose: 3000,
              });
            }
            
            return true;
          } catch (error) {
            console.error(`Ошибка при сохранении истории (уровень сжатия ${compressionLevel}):`, error);
            
            if (error.name === 'QuotaExceededError' || error.toString().includes('quota')) {
              // Если это ошибка квоты и мы еще не достигли максимального уровня сжатия
              if (compressionLevel < 3) {
                // Очищаем старые истории
                if (storiesToSave.length > 2) {
                  // Оставляем только новую историю и самую последнюю
                  const reducedStories = [storiesToSave[0], storiesToSave[1]];
                  return safelyStoreStories(reducedStories, currentStory, compressionLevel + 1);
                } else {
                  // Если осталась только одна история, пробуем сжать ее еще сильнее
                  return false; // Переходим к следующему уровню сжатия
                }
              } else {
                // Если достигли максимального уровня сжатия и все еще не можем сохранить
                toast.error('Не удалось сохранить историю. Хранилище переполнено.', {
                  position: 'top-right',
                  autoClose: 3000,
                });
                return false;
              }
            } else {
              // Если это другая ошибка
              toast.error('Произошла ошибка при сохранении истории', {
                position: 'top-right',
                autoClose: 3000,
              });
              return false;
            }
          }
        };
        
        // Сохранение истории с обработкой ошибок
        try {
          // Получаем текущие истории и добавляем новую в начало
          const stories = JSON.parse(localStorage.getItem('stories') || '[]');
          
          // Очищаем старые истории, если их слишком много
          const maxStories = 15;
          if (stories.length >= maxStories) {
            stories.splice(maxStories - 1); // Оставляем только maxStories-1 историй + новая
          }
          
          // Добавляем новую историю в начало
          stories.unshift(newStory);
          
          // Пробуем сохранить
          const saved = await safelyStoreStories(stories, newStory);
          
          // Если не удалось сохранить, пробуем с более сильным сжатием
          if (!saved) {
            // Создаем функцию для еще более сильного сжатия
            const furtherCompressImages = async (images, quality = 0.3, maxWidth = 400, maxHeight = 700) => {
              const lowerQualityImages = [];
              
              for (let i = 0; i < images.length; i++) {
                try {
                  const img = new Image();
                  img.src = images[i];
                  
                  await new Promise((resolve) => {
                    img.onload = resolve;
                  });
                  
                  const canvas = document.createElement('canvas');
                  const ctx = canvas.getContext('2d');
                  
                  // Уменьшенные размеры
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
                  
                  // Очень низкое качество
                  const lowerQualityImage = canvas.toDataURL('image/jpeg', quality);
                  lowerQualityImages.push(lowerQualityImage);
                } catch (error) {
                  console.error(`Ошибка при экстремальном сжатии изображения ${i}:`, error);
                  // Если не удалось сжать, пропускаем это изображение
                }
              }
              
              return lowerQualityImages;
            };
            
            // Пробуем сохранить с максимальным сжатием
            const extremelyCompressedImages = await furtherCompressImages(compressedImages, 0.2, 300, 500);
            
            // Если после сжатия остались изображения
            if (extremelyCompressedImages.length > 0) {
              // Обновляем историю с сильно сжатыми изображениями
              newStory.images = extremelyCompressedImages;
              newStory.image = extremelyCompressedImages[0];
              
              // Получаем истории снова (могли измениться)
              const updatedStories = JSON.parse(localStorage.getItem('stories') || '[]');
              
              // Оставляем только 2 истории максимум
              const minimalStories = [newStory];
              if (updatedStories.length > 0) {
                minimalStories.push(updatedStories[0]);
              }
              
              // Пробуем сохранить с минимальным количеством историй и максимальным сжатием
              await safelyStoreStories(minimalStories, newStory, 3);
            } else {
              // Если не осталось изображений после сжатия
              toast.error('Не удалось сохранить историю. Попробуйте изображения меньшего размера', {
                position: 'top-right',
                autoClose: 3000,
              });
            }
          }
        } catch (storageError) {
          console.error('Критическая ошибка при сохранении истории:', storageError);
          toast.error('Не удалось сохранить историю. Попробуйте позже', {
            position: 'top-right',
            autoClose: 3000,
          });
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
              disabled={imagePreviews.length === 0}
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