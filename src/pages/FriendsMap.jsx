import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Paper, Avatar, Card, CardContent, CardMedia, IconButton, Tooltip } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const FriendsMap = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [friendsWithLocations, setFriendsWithLocations] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  
  const currentUser = useSelector((state) => state.user.currentUser);
  const friendsList = useSelector((state) => state.frend.friendsList || []);
  const allFriends = useSelector((state) => state.frend.frends || []);
  
  // Mock locations for demonstration purposes
  const mockLocations = [
    { id: 1, lat: 55.751244, lng: 37.618423, name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1', lastPost: 'Enjoying the city views! #Moscow' },
    { id: 2, lat: 59.939095, lng: 30.315868, name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=2', lastPost: 'Beautiful architecture in Saint Petersburg' },
    { id: 3, lat: 43.238949, lng: 76.889709, name: 'Alice Johnson', avatar: 'https://i.pravatar.cc/150?img=3', lastPost: 'Almaty is amazing this time of year!' },
    { id: 4, lat: 51.507351, lng: -0.127758, name: 'Bob Wilson', avatar: 'https://i.pravatar.cc/150?img=4', lastPost: 'London calling! #UK #Travel' },
    { id: 5, lat: 48.856614, lng: 2.352222, name: 'Carol Martinez', avatar: 'https://i.pravatar.cc/150?img=5', lastPost: 'Paris is always a good idea ❤️' },
  ];
  
  useEffect(() => {
    // Load the Google Maps API script
    const loadGoogleMapsAPI = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
      
      // Note: In a real application, you would need to replace 'YOUR_API_KEY' with an actual Google Maps API key
      // For demo purposes, we'll simulate the map loading
      setTimeout(() => {
        setMapLoaded(true);
        toast.info('Map demo loaded! In a production app, this would use an actual Google Maps API key.');
      }, 1500);
    };
    
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.warning('Could not access your location. Using default location.');
          // Default location (Moscow)
          setUserLocation({ lat: 55.751244, lng: 37.618423 });
        }
      );
    } else {
      toast.warning('Geolocation is not supported by your browser. Using default location.');
      // Default location
      setUserLocation({ lat: 55.751244, lng: 37.618423 });
    }
    
    // Simulate loading friends with locations
    const loadFriendsLocations = () => {
      // In a real app, you would fetch this data from an API
      // For now, we'll use mock data
      setFriendsWithLocations(mockLocations);
    };
    
    loadGoogleMapsAPI();
    loadFriendsLocations();
  }, []);
  
  const initMap = () => {
    // This function would initialize the Google Map in a real application
    // For this demo, we're just setting state to indicate the map is loaded
    setMapLoaded(true);
  };
  
  const handleFriendClick = (friend) => {
    setSelectedFriend(friend);
  };
  
  const handleCloseInfo = () => {
    setSelectedFriend(null);
  };
  
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Friends Map
      </Typography>
      <Typography variant="body1" paragraph>
        See where your friends are and what they're up to around the world!
      </Typography>
      
      {/* Map Container */}
      <Paper 
        elevation={3} 
        sx={{ 
          height: '500px', 
          width: '100%', 
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 2,
          background: 'url(https://i.imgur.com/JXgwMsz.png) no-repeat center center',
          backgroundSize: 'cover'
        }}
      >
        {/* User location marker */}
        {userLocation && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10
            }}
          >
            <Tooltip title="Your location">
              <IconButton 
                sx={{ 
                  backgroundColor: 'primary.main', 
                  color: 'white',
                  '&:hover': { backgroundColor: 'primary.dark' } 
                }}
              >
                <MyLocationIcon />
              </IconButton>
            </Tooltip>
          </motion.div>
        )}
        
        {/* Friend markers */}
        {mapLoaded && friendsWithLocations.map((friend) => (
          <motion.div
            key={friend.id}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: friend.id * 0.1 }}
            style={{
              position: 'absolute',
              left: `${(friend.id * 15) + 10}%`,
              top: `${(friend.id * 10) + 20}%`,
              transform: 'translate(-50%, -50%)',
              cursor: 'pointer',
              zIndex: selectedFriend?.id === friend.id ? 20 : 5
            }}
            onClick={() => handleFriendClick(friend)}
          >
            <Avatar 
              src={friend.avatar} 
              alt={friend.name}
              sx={{ 
                width: 40, 
                height: 40, 
                border: '2px solid white',
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
              }} 
            />
            <LocationOnIcon 
              sx={{ 
                position: 'absolute', 
                bottom: -10, 
                left: '50%', 
                transform: 'translateX(-50%)', 
                color: 'error.main',
                fontSize: '1.5rem'
              }} 
            />
          </motion.div>
        ))}
        
        {/* Selected friend info */}
        {selectedFriend && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{
              position: 'absolute',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80%',
              maxWidth: '400px',
              zIndex: 30
            }}
          >
            <Card sx={{ display: 'flex', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar src={selectedFriend.avatar} sx={{ mr: 2 }} />
                    <Typography component="div" variant="h6">
                      {selectedFriend.name}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle1" color="text.secondary" component="div">
                    {selectedFriend.lastPost}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {`${selectedFriend.lat.toFixed(2)}, ${selectedFriend.lng.toFixed(2)}`}
                  </Typography>
                </CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                  <IconButton onClick={handleCloseInfo}>
                    Close
                  </IconButton>
                </Box>
              </Box>
            </Card>
          </motion.div>
        )}
        
        {!mapLoaded && (
          <Box 
            sx={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: 'white'
            }}
          >
            <Typography variant="h6">Loading map...</Typography>
          </Box>
        )}
      </Paper>
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Note: This is a demonstration of the Friends Map feature. In a production environment, 
          this would use the Google Maps API with real-time location data from your friends.
        </Typography>
      </Box>
    </Box>
  );
};

export default FriendsMap;