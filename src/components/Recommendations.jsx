import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Avatar, Button, Divider, Chip, styled } from '@mui/material';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL;

const Recommendations = () => {
  const [recommendedFriends, setRecommendedFriends] = useState([]);
  const [recommendedPosts, setRecommendedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useSelector((state) => state.user);
  const { friendsList } = useSelector((state) => state.frend);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        // Try to fetch recommendations from API
        const [friendsResponse, postsResponse] = await Promise.allSettled([
          axios.get(`${API_URL}/recommendations/friends`),
          axios.get(`${API_URL}/recommendations/posts`)
        ]);

        // Process friend recommendations
        if (friendsResponse.status === 'fulfilled') {
          setRecommendedFriends(friendsResponse.value.data);
        } else {
          // Fallback to mock data if API fails
          setRecommendedFriends(generateMockFriendRecommendations());
        }

        // Process post recommendations
        if (postsResponse.status === 'fulfilled') {
          setRecommendedPosts(postsResponse.value.data);
        } else {
          // Fallback to mock data if API fails
          setRecommendedPosts(generateMockPostRecommendations());
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        // Fallback to mock data
        setRecommendedFriends(generateMockFriendRecommendations());
        setRecommendedPosts(generateMockPostRecommendations());
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  // Generate mock friend recommendations
  const generateMockFriendRecommendations = () => {
    return [
      {
        id: 101,
        name: 'Алексей Петров',
        avatar: 'https://i.pravatar.cc/150?img=11',
        status: 'online',
        mutualFriends: 3,
        interests: ['Программирование', 'Музыка']
      },
      {
        id: 102,
        name: 'Мария Иванова',
        avatar: 'https://i.pravatar.cc/150?img=5',
        status: 'offline',
        mutualFriends: 2,
        interests: ['Дизайн', 'Фотография']
      },
      {
        id: 103,
        name: 'Дмитрий Сидоров',
        avatar: 'https://i.pravatar.cc/150?img=12',
        status: 'online',
        mutualFriends: 5,
        interests: ['Спорт', 'Путешествия']
      }
    ];
  };

  // Generate mock post recommendations
  const generateMockPostRecommendations = () => {
    return [
      {
        id: 201,
        user: {
          id: 105,
          name: 'Екатерина Смирнова',
          avatar: 'https://i.pravatar.cc/150?img=9'
        },
        image: 'https://source.unsplash.com/random/800x600?sig=20',
        description: 'Невероятный закат на побережье! #путешествия #природа',
        likes: 78,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        tags: ['путешествия', 'природа', 'фотография']
      },
      {
        id: 202,
        user: {
          id: 106,
          name: 'Игорь Волков',
          avatar: 'https://i.pravatar.cc/150?img=15'
        },
        image: 'https://source.unsplash.com/random/800x600?sig=21',
        description: 'Новый проект на React и Redux. Делюсь опытом разработки #программирование #webdev',
        likes: 45,
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        tags: ['программирование', 'разработка', 'react']
      }
    ];
  };

  // Filter out friends that are already in user's friend list
  const filteredFriendRecommendations = recommendedFriends.filter(
    friend => !friendsList?.includes(friend.id)
  );

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Загрузка рекомендаций...</Typography>
      </Box>
    );
  }

  return (
    <RecommendationsContainer>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
        Рекомендации для вас
      </Typography>
      
      {/* Friend Recommendations */}
      {filteredFriendRecommendations.length > 0 && (
        <Section>
          <Typography variant="h6" gutterBottom>
            Люди, которых вы можете знать
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
            {filteredFriendRecommendations.map(friend => (
              <motion.div
                key={friend.id}
                whileHover={{ y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <FriendCard>
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <Avatar 
                      src={friend.avatar} 
                      alt={friend.name} 
                      sx={{ width: 80, height: 80, margin: '0 auto 10px' }}
                    />
                    <Typography variant="h6" noWrap>
                      {friend.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      {friend.mutualFriends} общих друзей
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center', mb: 2 }}>
                      {friend.interests.map((interest, index) => (
                        <Chip 
                          key={index} 
                          label={interest} 
                          size="small" 
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                    </Box>
                    
                    <Link to={`/profile/${friend.id}`} style={{ textDecoration: 'none' }}>
                      <Button variant="contained" fullWidth size="small">
                        Посмотреть профиль
                      </Button>
                    </Link>
                  </CardContent>
                </FriendCard>
              </motion.div>
            ))}
          </Box>
        </Section>
      )}
      
      <Divider sx={{ my: 3 }} />
      
      {/* Post Recommendations */}
      {recommendedPosts.length > 0 && (
        <Section>
          <Typography variant="h6" gutterBottom>
            Рекомендуемые посты
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {recommendedPosts.map(post => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PostCard>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar src={post.user.avatar} alt={post.user.name} />
                      <Box sx={{ ml: 1 }}>
                        <Typography variant="subtitle1">
                          {post.user.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(post.timestamp).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {post.image && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={post.image}
                        alt="Post image"
                        sx={{ borderRadius: 1, mb: 1 }}
                      />
                    )}
                    
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {post.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                      {post.tags.map((tag, index) => (
                        <Chip 
                          key={index} 
                          label={`#${tag}`} 
                          size="small" 
                          color="primary"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        {post.likes} лайков
                      </Typography>
                      <Link to={`/post/${post.id}`} style={{ textDecoration: 'none' }}>
                        <Button size="small" color="primary">
                          Подробнее
                        </Button>
                      </Link>
                    </Box>
                  </CardContent>
                </PostCard>
              </motion.div>
            ))}
          </Box>
        </Section>
      )}
      
      {filteredFriendRecommendations.length === 0 && recommendedPosts.length === 0 && (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">
            У нас пока нет рекомендаций для вас. Добавьте больше информации в свой профиль, чтобы получать персонализированные предложения.
          </Typography>
        </Box>
      )}
    </RecommendationsContainer>
  );
};

// Styled Components
const RecommendationsContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#f5f5f5',
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

const Section = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const FriendCard = styled(Card)(({ theme }) => ({
  width: 180,
  borderRadius: theme.spacing(2),
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
  },
}));

const PostCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
  },
}));

export default Recommendations;