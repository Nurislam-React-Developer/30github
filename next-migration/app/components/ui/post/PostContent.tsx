'use client';

import { useEffect, useRef, useState } from 'react';

interface PostContentProps {
	post: {
		image?: string;
		description?: string;
	};
	darkMode: boolean;
}

const getFallbackImage = (size: string, text: string) => {
	return `https://via.placeholder.com/${size}?text=${text}`;
};

const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
	const target = e.target as HTMLImageElement;
	target.src = getFallbackImage('400x400', 'Error+Loading+Image');
};

const PostContent = ({ post, darkMode }: PostContentProps) => {
	const [isVisible, setIsVisible] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);
	const imgRef = useRef<HTMLDivElement>(null);

	// Set up intersection observer for lazy loading
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					setIsVisible(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.1 } // Trigger when 10% of the element is visible
		);

		if (imgRef.current) {
			observer.observe(imgRef.current);
		}

		return () => {
			if (imgRef.current) {
				observer.disconnect();
			}
		};
	}, []);

	const handleImageLoad = () => {
		setIsLoaded(true);
	};

	return (
		<>
			<div ref={imgRef} className='relative h-[400px]'>
				{(isVisible || isLoaded) && (
					<div className='relative w-full h-full'>
						<img
							src={post?.image || getFallbackImage('400x400', 'No+Image')}
							alt='Post image'
							className={`w-full h-full object-cover transition-opacity duration-300 ${
								isLoaded ? 'opacity-100' : 'opacity-0'
							}`}
							onError={handleImageError}
							onLoad={handleImageLoad}
						/>
					</div>
				)}
				{!isLoaded && (
					<div
						className={`absolute inset-0 flex justify-center items-center ${
							darkMode ? 'bg-secondary-dark' : 'bg-secondary-light'
						}`}
					>
						<p className='text-gray-500 dark:text-gray-400'>
							Загрузка изображения...
						</p>
					</div>
				)}
			</div>
			<div className='p-4'>
				<p
					className={`text-base mb-4 ${
						darkMode ? 'text-text-dark' : 'text-text-light'
					}`}
				>
					{post?.description || 'No description'}
				</p>
				<hr className='my-2 border-gray-200 dark:border-gray-700' />
			</div>
		</>
	);
};

export default PostContent;
