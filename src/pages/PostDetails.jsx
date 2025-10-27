import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IconEdit, IconCheck, IconX } from '@tabler/icons-react';
import { useAuth } from '../auth/AuthProvider';
import Comment from '../components/Comment';
import { useApiFetch } from '../services/apiFetch';
import { API_URL } from '../services/api';

import {
	Group,
	Button,
	Container,
	Paper,
	Text,
	Title,
	Stack,
	Badge,
	Switch,
} from '@mantine/core';

function PostDetails() {
	const { id } = useParams();
	const { isAuthenticated, user } = useAuth();
	const [post, setPost] = useState(null);
	const [comments, setComments] = useState([]);
	const [content, setContent] = useState('');
	const token = localStorage.getItem('token');
	const navigate = useNavigate();
	const apiFetch = useApiFetch();

	const togglePublish = async () => {
		try {
			const res = await apiFetch(`${API_URL}/admin/${user.id}/posts/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ published: !post.published }),
			});
			const json = await res.json();
			setPost(json.data);
		} catch (err) {
			console.error(err);
		}
	};

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

	if (!post) return <p>Loading...</p>;

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
			<Paper radius="lg" shadow="xl" p="xl">
				<Group
					justify="space-between"
					align="flex-start"
					gap="sm"
					wrap="wrap"
					style={{ width: '100%' }}
				>
					<Stack style={{ minWidth: 0 }}>
						<Title
							wrap="wrap"
							color="black"
							order={1}
							style={{ wordBreak: 'break-word' }}
						>
							{post.title}
						</Title>
						<Group gap="sm" align="center" wrap="wrap">
							<Badge color={post.published ? 'blue' : 'gray'}>
								{post.published ? 'Published' : 'Unpublished'}
							</Badge>
							<Button
								variant="subtle"
								onClick={handleEdit}
								radius="md"
								mt={{ base: 'sm', sm: 0 }}
								style={{ width: 'fit-content' }}
							>
								<IconEdit size={25} />
							</Button>
						</Group>
						<Text color="gray" size="sm" mt="sm">
							By {post?.author?.username} • {formatDate(post?.createdAt)}
						</Text>
					</Stack>

					{/* <Button
							onClick={togglePublish}
							size="sm"
							id="edit-button"
							p="xs"
							radius="md"
							leftSection={
								post.published ? <IconX size={20} /> : <IconCheck size={20} />
							}
							styles={{
								backgroundColor: 'cornflowerblue',
								marginLeft: '5px',
							}}
						>
							{post.published ? 'Unpublish' : 'Publish'}
						</Button> */}
					{/* <Switch
							size="md"
							defaultChecked
							label="Publish"
							onChange={togglePublish}
						/> */}
				</Group>

				<Text size="md" mt="md" my="xl">
					{post.content}
				</Text>
				<Paper bg="gray.1" radius="lg" shadow="sm" p="xl" mb="lg">
					<Title order={4}>
						{comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
					</Title>
					{comments.length === 0 ? (
						<Text>No comments yet</Text>
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
						<a href="/log-in">Log in</a> to add a comment.
					</Text>
				)}
			</Paper>
		);
	}
}

export default PostDetails;
