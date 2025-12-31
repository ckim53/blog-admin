import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IconEdit } from '@tabler/icons-react';
import { useAuth } from '../auth/AuthProvider';
import Comment from '../components/Comment';
import { useApiFetch } from '../services/apiFetch';
import { API_URL } from '../services/api';
import { Link } from 'react-router-dom';
import {
	Group,
	Button,
	Paper,
	Text,
	Title,
	Stack,
	Badge,
	Loader,
	Center,
} from '@mantine/core';

function PostDetails() {
	const { authorId, id } = useParams();
	const { isAuthenticated, user } = useAuth();
	const [post, setPost] = useState(null);
	const [comments, setComments] = useState([]);
	const [content, setContent] = useState('');
	const token = localStorage.getItem('token');
	const navigate = useNavigate();
	const apiFetch = useApiFetch();

	const formatDate = (iso) => {
		if (!iso) return '';
		return new Date(iso).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: '2-digit',
		});
	};

	const handleEdit = () => {
		navigate(`/admin/${user.id}/posts/${post.id}/edit`);
	};

	const fetchComments = async () => {
		try {
			const res = await apiFetch(`${API_URL}/posts/${id}/comments`);
			const json = await res.json();
			setComments(json.data || []);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		apiFetch(`${API_URL}/posts/${id}`)
			.then((res) => res.json())
			.then((json) => setPost(json.data));
	}, [id]);

	useEffect(() => {
		apiFetch(`${API_URL}/posts/${id}/comments`)
			.then((res) => res.json())
			.then((json) => setComments(json.data || []))
			.catch((err) => console.error(err));
	}, [id]);

	if (!post) {
		return (
			<Center mt={200}>
				<Loader color="blue" />
			</Center>
		);
	}

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const res = await apiFetch(`${API_URL}/posts/${id}/comments`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					content,
				}),
			});

			const text = await res.text();
			const data = text ? JSON.parse(text) : null;

			if (res.ok) {
				await fetchComments();
				setContent('');
			} else {
				if (res.status === 400 || res.status === 401) {
					alert('You must be logged in to comment on posts.');
				} else {
					alert(
						`Failed to add comment. Status: ${res.status}, Error: ${data.error || data}`
					);
				}
				setContent('');
			}
		} catch (err) {
			alert('Server error. Try again later.');
		}
	};

	if (!user) {
		navigate('/');
	} else {
		return (
			<Paper radius="lg" shadow="xl" p="xl" w="100%" miw={800}>
				<Group
					justify="space-between"
					align="flex-start"
					gap="sm"
					wrap="wrap"
					style={{ width: '100%' }}
				>
					<Stack style={{ minWidth: 0 }}>
						<Title
							size={45}
							wrap="wrap"
							color="black"
							order={1}
							style={{ wordBreak: 'break-word' }}
						>
							{post.title}
						</Title>
						<Group gap="sm" align="center" wrap="wrap">
							<Badge size="lg" color={post.published ? 'blue' : 'gray'}>
								{post.published ? 'Published' : 'Unpublished'}
							</Badge>
							{!post.isProtected && (
								<Button
									variant="subtle"
									onClick={handleEdit}
									radius="md"
									mt={{ base: 'sm', sm: 0 }}
									style={{ width: 'fit-content' }}
								>
									<IconEdit size={30} />
								</Button>
							)}
						</Group>
						<Text color="gray" size="lg">
							By {post?.author?.displayName} • {formatDate(post?.createdAt)}
						</Text>
					</Stack>
				</Group>

				<Text
					size="xl"
					mt="md"
					my="xl"
					style={{
						whiteSpace: 'pre-wrap',
						lineHeight: 1.7,
					}}
				>
					{post.content}
				</Text>
				<Paper bg="gray.1" radius="lg" shadow="xs" p="xl" mb="lg">
					<Title order={3}>
						{comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
					</Title>
					{comments.length === 0 ? (
						<Text size="lg">No comments yet</Text>
					) : (
						<Paper bg="white" mt="md" shadow="sm" p="md" radius="md">
							<Stack>
								{comments.map((c) => (
									<Comment key={c.id} comment={c} />
								))}
							</Stack>
						</Paper>
					)}
				</Paper>
				{isAuthenticated ? (
					<Paper withBorder p="md" radius="md" mt="md">
						<form onSubmit={handleSubmit}>
							<textarea
								placeholder="Add comment"
								value={content}
								onChange={(e) => setContent(e.target.value)}
								required
								style={{
									width: '100%',
									minHeight: '80px',
									padding: '0.5rem',
									borderRadius: '5px',
									borderWidth: '0.5px',
									fontSize: 'large',
								}}
							/>
							<Button
								type="submit"
								style={{ backgroundColor: '#2e949f' }}
								size="md"
								p="sm"
								radius="md"
								mt="xs"
							>
								Post Comment
							</Button>
						</form>
					</Paper>
				) : (
					<Text c="dimmed" mt="md">
						<Link to="/log-in">Log in</Link> to add a comment.
					</Text>
				)}
			</Paper>
		);
	}
}

export default PostDetails;
