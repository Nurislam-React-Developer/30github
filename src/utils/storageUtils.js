/**
 * Utility functions for managing localStorage and image compression
 */

/**
 * Estimates the size of an object in bytes when stored in localStorage
 * @param {Object} object - The object to estimate size for
 * @returns {number} - Estimated size in bytes
 */
export const estimateSize = (object) => {
  const jsonString = JSON.stringify(object);
  return jsonString.length * 2; // Each character in UTF-16 takes 2 bytes
};

/**
 * Checks the total size of localStorage and returns percentage used
 * @returns {number} - Percentage of storage used (0-100)
 */
export const getStorageUsagePercentage = () => {
  try {
    let totalSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length * 2; // Each character takes 2 bytes
      }
    }
    
    // Most browsers have a 5MB limit for localStorage
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    return (totalSize / maxSize) * 100;
  } catch (error) {
    console.error('Error calculating storage usage:', error);
    return 0;
  }
};

/**
 * Compresses an image with adaptive quality based on storage constraints
 * @param {string} dataUrl - The image data URL to compress
 * @param {Object} options - Compression options
 * @param {number} options.quality - Initial quality (0-1)
 * @param {number} options.maxWidth - Maximum width in pixels
 * @param {number} options.maxHeight - Maximum height in pixels
 * @returns {Promise<string>} - Compressed image data URL
 */
export const compressImage = async (dataUrl, options = {}) => {
  const {
    quality = 0.6,
    maxWidth = 720,
    maxHeight = 1080
  } = options;
  
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      img.src = dataUrl;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate dimensions while maintaining aspect ratio
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
        
        // Set canvas dimensions and draw image
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        // Get compressed image
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Safely stores data in localStorage with fallback strategies
 * @param {string} key - The localStorage key
 * @param {any} data - The data to store
 * @param {Function} onSuccess - Callback on successful storage
 * @param {Function} onError - Callback on storage error
 * @returns {boolean} - Whether storage was successful
 */
export const safelyStoreData = (key, data, onSuccess, onError) => {
  try {
    // Try to store the data
    localStorage.setItem(key, JSON.stringify(data));
    if (onSuccess) onSuccess();
    return true;
  } catch (error) {
    console.error(`Error storing data in localStorage (${key}):`, error);
    
    // If it's a quota exceeded error, try cleanup strategies
    if (error.name === 'QuotaExceededError' || error.toString().includes('quota')) {
      // Try to clean up storage and retry
      if (onError) onError(error);
    } else {
      // For other errors, just notify
      if (onError) onError(error);
    }
    return false;
  }
};

/**
 * Cleans up localStorage by removing expired items and reducing data size
 * @param {Object} options - Cleanup options
 * @param {string[]} options.keysToPreserve - Keys that should not be removed
 * @param {number} options.targetPercentage - Target storage usage percentage after cleanup
 * @returns {boolean} - Whether cleanup was successful
 */
export const cleanupStorage = (options = {}) => {
  const {
    keysToPreserve = [],
    targetPercentage = 70
  } = options;
  
  try {
    // If storage usage is below target, no need to clean up
    const usagePercentage = getStorageUsagePercentage();
    if (usagePercentage < targetPercentage) return true;
    
    // Get all keys except those to preserve
    const keysToConsider = Object.keys(localStorage).filter(
      key => !keysToPreserve.includes(key)
    );
    
    // Sort keys by priority (you can customize this logic)
    // For now, we'll just remove the largest items first
    const keysBySize = keysToConsider.map(key => ({
      key,
      size: localStorage[key].length
    })).sort((a, b) => b.size - a.size);
    
    // Remove items until we reach target percentage or run out of items
    for (const {key} of keysBySize) {
      localStorage.removeItem(key);
      
      // Check if we've reached target
      if (getStorageUsagePercentage() < targetPercentage) {
        return true;
      }
    }
    
    // If we've removed all non-essential items and still above target
    return getStorageUsagePercentage() < 95; // At least ensure we're not completely full
  } catch (error) {
    console.error('Error during storage cleanup:', error);
    return false;
  }
};

/**
 * Manages stories in localStorage with automatic cleanup and compression
 */
export const StoriesManager = {
  /**
   * Gets all stories from localStorage
   * @returns {Array} - Array of story objects
   */
  getStories: () => {
    try {
      return JSON.parse(localStorage.getItem('stories') || '[]');
    } catch (error) {
      console.error('Error getting stories:', error);
      return [];
    }
  },
  
  /**
   * Adds a new story with automatic storage management
   * @param {Object} story - The story object to add
   * @param {Function} onSuccess - Callback on successful addition
   * @param {Function} onError - Callback on error
   * @returns {Promise<boolean>} - Whether addition was successful
   */
  addStory: async (story, onSuccess, onError) => {
    try {
      // Get current stories
      const stories = StoriesManager.getStories();
      
      // Add new story at the beginning
      stories.unshift(story);
      
      // Limit the number of stories
      const maxStories = 15;
      if (stories.length > maxStories) {
        stories.splice(maxStories);
      }
      
      // Try to store stories
      const stored = safelyStoreData('stories', stories, onSuccess, async () => {
        // If storage failed, try cleanup
        cleanupStorage({
          keysToPreserve: ['user', 'userSettings', 'profileName', 'profileAvatar'],
          targetPercentage: 70
        });
        
        // Try again with fewer stories
        const reducedStories = stories.slice(0, Math.max(5, Math.floor(stories.length / 2)));
        return safelyStoreData('stories', reducedStories, onSuccess, onError);
      });
      
      return stored;
    } catch (error) {
      console.error('Error adding story:', error);
      if (onError) onError(error);
      return false;
    }
  },
  
  /**
   * Removes expired stories
   * @returns {number} - Number of stories removed
   */
  removeExpiredStories: () => {
    try {
      const stories = StoriesManager.getStories();
      const now = Date.now();
      
      const validStories = stories.filter(story => {
        const expiryTime = new Date(story.expiresAt).getTime();
        return expiryTime > now;
      });
      
      if (validStories.length !== stories.length) {
        localStorage.setItem('stories', JSON.stringify(validStories));
        return stories.length - validStories.length;
      }
      
      return 0;
    } catch (error) {
      console.error('Error removing expired stories:', error);
      return 0;
    }
  },
  
  /**
   * Marks a story as viewed
   * @param {string|number} storyId - ID of the story to mark as viewed
   */
  markAsViewed: (storyId) => {
    try {
      const viewedStories = JSON.parse(localStorage.getItem('viewedStories') || '[]');
      
      if (!viewedStories.includes(storyId)) {
        viewedStories.push(storyId);
        localStorage.setItem('viewedStories', JSON.stringify(viewedStories));
      }
    } catch (error) {
      console.error('Error marking story as viewed:', error);
    }
  },
  
  /**
   * Gets IDs of viewed stories
   * @returns {Array} - Array of viewed story IDs
   */
  getViewedStories: () => {
    try {
      return JSON.parse(localStorage.getItem('viewedStories') || '[]');
    } catch (error) {
      console.error('Error getting viewed stories:', error);
      return [];
    }
  },
  
  /**
   * Cleans up viewed stories that no longer exist
   */
  cleanupViewedStories: () => {
    try {
      const stories = StoriesManager.getStories();
      const viewedStories = StoriesManager.getViewedStories();
      
      const storyIds = stories.map(story => story.id);
      const validViewedStories = viewedStories.filter(id => storyIds.includes(id));
      
      if (validViewedStories.length !== viewedStories.length) {
        localStorage.setItem('viewedStories', JSON.stringify(validViewedStories));
      }
    } catch (error) {
      console.error('Error cleaning up viewed stories:', error);
    }
  }
};