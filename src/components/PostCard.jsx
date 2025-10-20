import { Link } from 'react-router-dom';
import './post-card.css';
import useAuth from '../hooks/useAuth';
import { Badge, Group, Text, Title } from '@mantine/core';

function formatDate(iso) {
	if (!iso) return '';
	return new Date(iso).toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'short',
		day: '2-digit',
	});
}

export function PostCard({ post }) {
	const { isAuthenticated, user } = useAuth();
	const authorName =
		post?.author?.displayName || post?.author?.username || 'Unknown';
	const commentCount = Array.isArray(post?.comments) ? post.comments.length : 0;
	const preview =
		(post?.content || '').length > 120
			? `${post.content.slice(0, 120)}…`
			: post?.content || '';
	return (
		<article className="post-card">
			<header className="post-card-header">
				<Group preventGrowOverflow={false} wrap="nowrap">
					<Title className="post-card-title" order={2}>
						{isAuthenticated ? (
							<Link to={`/admin/${user.id}/posts/${post.id}`}>
								{post.title || 'Untitled Post'}
							</Link>
						) : (
							<Link to={`/posts/${post.id}`}>
								{post.title || 'Untitled Post'}
							</Link>
						)}
					</Title>
					<Badge color={post.published ? 'blue' : 'gray'}>
						{post.published ? 'Published' : 'Unpublished'}
					</Badge>
				</Group>
				<Text color="gray" size="sm" mt="sm" className="post-card-meta">
					By {authorName} • {formatDate(post?.createdAt)} • {commentCount}{' '}
					comment{commentCount === 1 ? '' : 's'}
				</Text>
			</header>
			<p className="post-card-preview">{preview}</p>
		</article>
	);
}

export default PostCard;
