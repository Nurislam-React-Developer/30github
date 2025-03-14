/**
 * Utility functions for handling images in the application
 */

// Base64 encoded small placeholder image (1x1 pixel gray)
const BASE64_PLACEHOLDER =
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

/**
 * Returns a fallback image when the original image is not available
 * @param {string} size - Size of the image in format '400x400'
 * @param {string} text - Optional text to display on the placeholder
 * @param {string} originalSrc - Original image source that failed to load
 * @returns {string} - URL for the fallback image
 */
export const getFallbackImage = (
	size = '150x150',
	text = '',
	originalSrc = null
) => {
	// If we have a local image in public folder, use it
	if (text.toLowerCase().includes('avatar') || size === '150x150') {
		return '/logo.png';
	}

	// For post images, use a different background
	if (size === '400x400' || size.includes('800x')) {
		return '/sunsetBackground.png';
	}

	// Default fallback to base64 encoded image
	return BASE64_PLACEHOLDER;
};

/**
 * Handles image loading errors by replacing with fallback
 * @param {Event} event - The error event from img element
 */
export const handleImageError = (event) => {
	const imgElement = event.target;
	const size = imgElement.width + 'x' + imgElement.height;
	imgElement.src = getFallbackImage(size);
};
