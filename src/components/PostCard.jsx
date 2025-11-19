import './post-card.css';
import {
	Badge,
	Group,
	Paper,
	Text,
	Title,
	Box,
	Switch,
	Stack,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

export function PostCard({ post }) {
	const { isAuthenticated, user } = useAuth();
	const navigate = useNavigate();
	const authorName = post?.author?.displayName || 'Unknown';
	const commentCount = Array.isArray(post?.comments) ? post.comments.length : 0;
	const preview =
		(post?.content || '').length > 120
			? `${post.content.slice(0, 120)}…`
			: post?.content || '';

	const formatDate = (iso) => {
		if (!iso) return '';
		return new Date(iso).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: '2-digit',
		});
	};

	const handleClick = () => {
		{
			const route = isAuthenticated
				? `/admin/${user.id}/posts/${post.id}`
				: `/posts/${post.id}`;
			navigate(route);
		}
	};

	return (
		<Paper
			onClick={handleClick}
			className="post-card"
			p="xl"
			radius="lg"
			style={{
				borderColor: '#eee',
				transition: 'transform 0.1s ease',
			}}
		>
			<Box mb={8}>
				<Stack preventgrowoverflow="false" wrap="nowrap">
					<Title order={1} style={{ overflowWrap: 'anywhere' }}>
						{post.title}
					</Title>
					<Badge color={post.published ? 'blue' : 'gray'}>
						{post.published ? 'Published' : 'Unpublished'}
					</Badge>
				</Stack>
				<Text color="gray" size="sm" mt="sm">
					By {authorName} • {formatDate(post?.createdAt)} • {commentCount}{' '}
					comment{commentCount === 1 ? '' : 's'}
				</Text>
			</Box>
			<Text size="lg" style={{ color: '#333' }}>
				{preview}{' '}
			</Text>
		</Paper>
	);
}

export default PostCard;
