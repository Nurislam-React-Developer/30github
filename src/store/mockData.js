export const mockPosts = [
  {
    id: 1,
    user: {
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    image: 'https://source.unsplash.com/random/800x600?sig=1',
    description: 'Beautiful day in paradise! #nature #adventure',
    likes: 42,
    liked: false,
    comments: [
      {
        id: 1,
        user: {
          name: 'Jane Smith',
          avatar: 'https://i.pravatar.cc/150?img=2'
        },
        text: 'Amazing view! Where is this?',
        timestamp: '2024-01-15T10:30:00Z'
      }
    ],
    timestamp: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    user: {
      name: 'Alice Johnson',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    image: 'https://source.unsplash.com/random/800x600?sig=2',
    description: 'Coding session in progress 💻 #programming #developer',
    likes: 28,
    liked: false,
    comments: [],
    timestamp: '2024-01-15T09:30:00Z'
  }
];