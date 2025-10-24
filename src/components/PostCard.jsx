import './post-card.css';
import { Badge, Group, Paper, Text, Title, Box } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

function formatDate(iso) {
	if (!iso) return '';
	return new Date(iso).toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'short',
		day: '2-digit',
	});
}

function handleClick(isAuth, post, user, navigate) {
	{
		const route = isAuth
			? `/admin/${user.id}/posts/${post.id}`
			: `/posts/${post.id}`;
		navigate(route);
	}
}

export function PostCard({ post }) {
	const { isAuthenticated, user } = useAuth();
	const navigate = useNavigate();
	const authorName =
		post?.author?.displayName || post?.author?.username || 'Unknown';
	const commentCount = Array.isArray(post?.comments) ? post.comments.length : 0;
	const preview =
		(post?.content || '').length > 120
			? `${post.content.slice(0, 120)}…`
			: post?.content || '';
	return (
		<Paper
			onClick={() => {
				handleClick(isAuthenticated, post, user, navigate);
			}}
			className="post-card"
			p="xl"
			radius="lg"
			style={{
				borderColor: '#eee',
				transition: 'transform 0.1s ease',
			}}
		>
			<Box mb={8}>
				<Group preventGrowOverflow={false} wrap="nowrap">
					<Title order={2}>{post.title}</Title>
					<Badge color={post.published ? 'blue' : 'gray'}>
						{post.published ? 'Published' : 'Unpublished'}
					</Badge>
				</Group>
				<Text color="gray" size="sm" mt="sm" className="post-card-meta">
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
