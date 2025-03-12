import React, { useState } from 'react';
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  TextField,
  Button,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../store/userSlice';
import { compressImage, StoriesManager, cleanupStorage, getStorageUsagePercentage } from '../../../utils/storageUtils';

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
  
  const handleSave = async () => {
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
          const saved = safelyStoreStories(stories, newStory);
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
  )
}

export default CreateStoryDialog;