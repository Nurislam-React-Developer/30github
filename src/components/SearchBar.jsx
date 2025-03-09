import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, InputAdornment, IconButton, Paper, Typography, Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import ArticleIcon from '@mui/icons-material/Article';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState({ friends: [], posts: [] });
  const [activeTab, setActiveTab] = useState('all');
  const [recentSearches, setRecentSearches] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { frends } = useSelector((state) => state.frend);

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Handle clicks outside the search component to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearching(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Search function that combines local and API search
  const handleSearch = async (term) => {
    if (!term.trim()) {
      setSearchResults({ friends: [], posts: [] });
      return;
    }

    // Local search for friends
    const filteredFriends = frends.filter(friend => 
      friend.name.toLowerCase().includes(term.toLowerCase())
    );

    try {
      // API search for posts
      const response = await axios.get(`${API_URL}/posts?q=${term}`);
      const posts = response.data || [];
      
      setSearchResults({
        friends: filteredFriends,
        posts: posts
      });
    } catch (error) {
      console.error('Error searching posts:', error);
      // If API fails, just use local search results
      setSearchResults({
        friends: filteredFriends,
        posts: []
      });
    }
  };

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        handleSearch(searchTerm);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value) {
      setIsSearching(true);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setIsSearching(false);
  };

  const handleResultClick = (type, item) => {
    // Save to recent searches
    const newSearch = {
      id: Date.now(),
      term: searchTerm,
      type: type,
      itemId: item.id,
      name: type === 'friend' ? item.name : item.description?.substring(0, 30) + '...'
    };
    
    const updatedSearches = [newSearch, ...recentSearches.slice(0, 4)];
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    
    // Navigate to the appropriate page
    if (type === 'friend') {
      navigate(`/profile/${item.id}`);
    } else if (type === 'post') {
      // Assuming you have a post detail page
      navigate(`/post/${item.id}`);
    }
    
    setIsSearching(false);
  };

  const removeRecentSearch = (id) => {
    const updatedSearches = recentSearches.filter(search => search.id !== id);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  const filterResults = () => {
    if (activeTab === 'all') return searchResults;
    if (activeTab === 'friends') return { friends: searchResults.friends, posts: [] };
    if (activeTab === 'posts') return { friends: [], posts: searchResults.posts };
    return searchResults;
  };

  const filteredResults = filterResults();
  const hasResults = filteredResults.friends.length > 0 || filteredResults.posts.length > 0;

  return (
    <Box ref={searchRef} sx={{ position: 'relative', width: '100%', maxWidth: 500, margin: '0 auto' }}>
      <TextField
        fullWidth
        placeholder="Поиск друзей и постов..."
        value={searchTerm}
        onChange={handleInputChange}
        onClick={() => setIsSearching(true)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton onClick={clearSearch} edge="end">
                <CloseIcon />
              </IconButton>
            </InputAdornment>
          ),
          sx: { borderRadius: 2 }
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
            },
          },
        }}
      />
      
      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Paper 
              elevation={3} 
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                mt: 1,
                zIndex: 1000,
                maxHeight: 400,
                overflow: 'auto',
                borderRadius: 2,
                p: 2
              }}
            >
              {/* Search filter tabs */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip 
                  label="Все" 
                  onClick={() => setActiveTab('all')}
                  color={activeTab === 'all' ? 'primary' : 'default'}
                  variant={activeTab === 'all' ? 'filled' : 'outlined'}
                />
                <Chip 
                  label="Друзья" 
                  onClick={() => setActiveTab('friends')}
                  color={activeTab === 'friends' ? 'primary' : 'default'}
                  variant={activeTab === 'friends' ? 'filled' : 'outlined'}
                  icon={<PersonIcon />}
                />
                <Chip 
                  label="Посты" 
                  onClick={() => setActiveTab('posts')}
                  color={activeTab === 'posts' ? 'primary' : 'default'}
                  variant={activeTab === 'posts' ? 'filled' : 'outlined'}
                  icon={<ArticleIcon />}
                />
              </Box>
              
              {/* Search results */}
              {searchTerm ? (
                hasResults ? (
                  <List>
                    {filteredResults.friends.length > 0 && (
                      <>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1, mb: 1 }}>
                          Друзья
                        </Typography>
                        {filteredResults.friends.map(friend => (
                          <ListItem 
                            key={`friend-${friend.id}`} 
                            button 
                            onClick={() => handleResultClick('friend', friend)}
                            sx={{ borderRadius: 1, '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' } }}
                          >
                            <ListItemAvatar>
                              <Avatar src={friend.avatar} alt={friend.name} />
                            </ListItemAvatar>
                            <ListItemText 
                              primary={friend.name} 
                              secondary={friend.status === 'online' ? 'В сети' : 'Не в сети'} 
                            />
                          </ListItem>
                        ))}
                        {filteredResults.posts.length > 0 && <Divider sx={{ my: 1 }} />}
                      </>
                    )}
                    
                    {filteredResults.posts.length > 0 && (
                      <>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1, mb: 1 }}>
                          Посты
                        </Typography>
                        {filteredResults.posts.map(post => (
                          <ListItem 
                            key={`post-${post.id}`} 
                            button 
                            onClick={() => handleResultClick('post', post)}
                            sx={{ borderRadius: 1, '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' } }}
                          >
                            <ListItemAvatar>
                              <Avatar src={post.user.avatar} alt={post.user.name} />
                            </ListItemAvatar>
                            <ListItemText 
                              primary={post.description?.substring(0, 50) + (post.description?.length > 50 ? '...' : '')}
                              secondary={`${post.user.name} • ${new Date(post.timestamp).toLocaleDateString()}`} 
                            />
                          </ListItem>
                        ))}
                      </>
                    )}
                  </List>
                ) : (
                  <Box sx={{ py: 2, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                      Ничего не найдено
                    </Typography>
                  </Box>
                )
              ) : recentSearches.length > 0 ? (
                <>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Недавние поиски
                  </Typography>
                  <List>
                    {recentSearches.map(search => (
                      <ListItem 
                        key={search.id}
                        secondaryAction={
                          <IconButton edge="end" onClick={() => removeRecentSearch(search.id)}>
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        }
                        sx={{ borderRadius: 1, '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' } }}
                      >
                        <ListItemAvatar>
                          <Avatar>
                            {search.type === 'friend' ? <PersonIcon /> : <ArticleIcon />}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                          primary={search.name}
                          secondary={search.term}
                          onClick={() => navigate(search.type === 'friend' ? `/profile/${search.itemId}` : `/post/${search.itemId}`)}
                          sx={{ cursor: 'pointer' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              ) : (
                <Box sx={{ py: 2, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    Начните вводить для поиска
                  </Typography>
                </Box>
              )}
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default SearchBar;