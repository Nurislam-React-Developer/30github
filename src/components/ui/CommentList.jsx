import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import React from 'react';
import { toast } from 'react-toastify';

const CommentList = ({ comments, darkMode, onDeleteComment, postId }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const userName = currentUser?.name || localStorage.getItem('profileName');
  const posts = JSON.parse(localStorage.getItem('posts') || '[]');
  const currentPost = posts.find(post => post.id === postId);
  const isPostAuthor = currentPost?.author?.name === userName;
  const formatTimestamp = (timestamp) => {
    try {
      if (!timestamp) return 'Invalid date';
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return 'Invalid date';
      return format(date, 'dd MMMM в HH:mm', { locale: ru });
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'Invalid date';
    }
  };

  const handleLikeComment = (commentId) => {
    try {
      // Get current user
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const userName = currentUser?.name || localStorage.getItem('profileName');

      // Get all posts
      const posts = JSON.parse(localStorage.getItem('posts') || '[]');
      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          const updatedComments = post.comments.map(comment => {
            if (comment.id === commentId) {
              const likes = comment.likes || [];
              const userLiked = likes.includes(userName);
              
              if (userLiked) {
                // Unlike
                return {
                  ...comment,
                  likes: likes.filter(name => name !== userName)
                };
              } else {
                // Only create notification if the post author likes the comment
                if (isPostAuthor) {
                  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
                  notifications.unshift({
                    id: Date.now(),
                    type: 'comment_like',
                    user: userName,
                    postId: postId,
                    commentId: commentId,
                    timestamp: new Date().toISOString()
                  });
                  localStorage.setItem('notifications', JSON.stringify(notifications));
                  
                  // Show notification toast to comment owner
                  if (comment.user.name !== userName) {
                    toast.info(`${userName} лайкнул ваш комментарий`, {
                      position: 'top-right',
                      autoClose: 3000
                    });
                  }
                }
                
                return {
                  ...comment,
                  likes: [...likes, userName]
                };
              }
            }
            return comment;
          });
          return { ...post, comments: updatedComments };
        }
        return post;
      });


      localStorage.setItem('posts', JSON.stringify(updatedPosts));
      window.dispatchEvent(new Event('storage')); // Trigger update
    } catch (error) {
      console.error('Error handling comment like:', error);
      toast.error('Ошибка при обработке лайка');
    }
  };

  return (
    <>
      {comments.map((comment) => {
        const likes = comment.likes || [];
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const userName = currentUser?.name || localStorage.getItem('profileName');
        
        return (
          <CommentItem
            key={comment.id}
            comment={comment}
            darkMode={darkMode}
            onDeleteComment={onDeleteComment}
            postId={postId}
            formatTimestamp={formatTimestamp}
            userName={userName}
            handleLikeComment={handleLikeComment}
            isPostAuthor={isPostAuthor}
            likes={likes}
          />
        );
      })}
    </>
  );
};

export default CommentList;