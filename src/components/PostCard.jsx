import { Link } from 'react-router-dom';
import './PostCard.css';

function formatDate(iso) {
	if (!iso) return '';
	return new Date(iso).toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'short',
		day: '2-digit',
	});
}

export function PostCard({ post }) {
	const authorName =
		post?.author?.displayName || post?.author?.username || 'Unknown';
	const commentCount = Array.isArray(post?.comments) ? post.comments.length : 0;
	const preview =
		(post?.content || '').length > 140
			? `${post.content.slice(0, 140)}…`
			: post?.content || '';

	return (
		<article className="post-card">
			<header className="post-card-header">
				<h2 className="post-card-title">
					<Link to={`/posts/${post.id}`}>{post.title || 'Untitled Post'}</Link>
				</h2>
				<small className="post-card-meta">
					By {authorName} • {formatDate(post?.createdAt)} • {commentCount}{' '}
					comment{commentCount === 1 ? '' : 's'}
				</small>
			</header>
			<p className="post-card-preview">{preview}</p>
		</article>
	);
}
