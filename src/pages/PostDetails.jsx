import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAuth from '../../../blog-admin/src/hooks/useAuth';
import {
	Group,
	Button,
	Container,
	Paper,
	Text,
	Title,
	Stack,
} from '@mantine/core';

function PostDetails() {
	const { id } = useParams();
	const { isAuthenticated } = useAuth();
	const [post, setPost] = useState(null);
	const [comments, setComments] = useState([]);
	const [content, setContent] = useState('');
	const token = localStorage.getItem('token');

	const fetchComments = async () => {
		try {
			const res = await fetch(`http://localhost:3000/posts/${id}/comments`);
			const json = await res.json();
			setComments(json.data || []);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		fetch(`http://localhost:3000/posts/${id}`)
			.then((res) => res.json())
			.then((json) => setPost(json.data));
	}, [id]);

	useEffect(() => {
		fetch(`http://localhost:3000/posts/${id}/comments`)
			.then((res) => res.json())
			.then((json) => setComments(json.data || []))
			.catch((err) => console.error(err));
	}, [id]);

	if (!post) return <p>Loading...</p>;

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const res = await fetch(`http://localhost:3000/posts/${id}/comments`, {
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

	return (
		<div id="post-details">
			<Container m="xs">
				<Stack gap="lg">
					<Paper radius="lg" shadow="xl" p="xl">
						<Title color="black" order={1}>
							{post.title}
						</Title>
						<Text mt="md" my="xl">
							{post.content}
						</Text>

						<Paper bg="gray.1" radius="lg" shadow="sm" p="xl">
							<Title order={4}>
								{comments.length}{' '}
								{comments.length === 1 ? 'Comment' : 'Comments'}
							</Title>

							{comments.length === 0 ? (
								<Text>No comments yet</Text>
							) : (
								<Paper bg="white" mt="md" shadow="sm" p="md" radius="md">
									<Stack>
										{comments.map((c) => (
											<Text>
												<Group gap="xl">
													<Text fw={600}>{c.author.username}</Text>
													<Text color="gray">
														{new Date(c.createdAt).toLocaleString()}
													</Text>
												</Group>
												<Text>{c.content}</Text>
											</Text>
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
										}}
									/>
									<Button type="submit" size="md" radius="md" my="xs">
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
				</Stack>
			</Container>
		</div>
	);
}

export default PostDetails;
