'use client';

import { useTheme } from '@/app/theme/ThemeContext';
import PostActions from './PostActions';
import PostContent from './PostContent';
import PostHeader from './PostHeader';

interface Comment {
	id: number;
	userId: number;
	userName: string;
	userAvatar: string;
	text: string;
	timestamp: string;
}

interface Post {
	id: number;
	userId: number;
	userName: string;
	userAvatar: string;
	description?: string;
	image?: string;
	timestamp: string;
	likes: number;
	liked?: boolean;
	comments: Comment[];
	edited?: boolean;
}

interface PostCardProps {
	post: Post;
	currentUser: {
		id?: number;
		name?: string;
	};
	onLike: (postId: number) => void;
	onOpenComments: (post: Post) => void;
	onMenuOpen: (event: React.MouseEvent<HTMLButtonElement>, post: Post) => void;
	formatTimestamp: (timestamp: string) => string;
}

const PostCard = ({
	post,
	currentUser,
	onLike,
	onOpenComments,
	onMenuOpen,
	formatTimestamp,
}: PostCardProps) => {
	const { darkMode } = useTheme();

	return (
		<div
			className={`rounded-lg shadow-md overflow-hidden mb-6 transition-transform duration-200 hover:-translate-y-1 ${
				darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
			}`}
		>
			<PostHeader
				post={post}
				currentUser={currentUser}
				onMenuOpen={onMenuOpen}
				formatTimestamp={formatTimestamp}
			/>
			<PostContent post={post} darkMode={darkMode} />
			<div className='px-4 pb-4'>
				<PostActions
					post={post}
					onLike={onLike}
					onOpenComments={onOpenComments}
				/>
			</div>
		</div>
	);
};

export default PostCard;
