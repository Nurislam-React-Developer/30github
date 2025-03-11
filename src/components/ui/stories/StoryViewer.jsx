import React, { useState, useEffect } from 'react';
import {
  Box,
  Avatar,
  Typography,
  Dialog,
  IconButton,
  DialogContent,
  LinearProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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

export default StoryViewer;