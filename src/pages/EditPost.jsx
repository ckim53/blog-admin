import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../services/api';
import Comment from '../components/Comment';
import { useApiFetch } from '../services/apiFetch';
import { useAuth } from '../auth/AuthProvider';

import {
	Input,
	Group,
	Button,
	Container,
	Paper,
	Title,
	Stack,
	Textarea,
	Box,
} from '@mantine/core';

function EditPost() {
	const { id } = useParams();
	const [originalPost, setOriginalPost] = useState(null);
	const [post, setPost] = useState(null);
	const [comments, setComments] = useState([]);
	const [isChanged, setIsChanged] = useState(false);
	const apiFetch = useApiFetch();
	const navigate = useNavigate();
	const { user } = useAuth();
	const token = localStorage.getItem('token');

	const fetchComments = async () => {
		try {
			const res = await apiFetch(`${API_URL}/posts/${id}/comments`);
			const json = await res.json();
			setComments(json.data || []);
		} catch (err) {
			console.error(err);
		}
	};

	const handleDeleteComment = async (id) => {
		const confirmDelete = window.confirm(
			'Are you sure you want to delete this comment?'
		);
		if (!confirmDelete) return;

		try {
			const res = await apiFetch(
				`${API_URL}/admin/${user.id}/posts/${post.id}/comments/${id}`,
				{
					method: 'DELETE',
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (!res.ok) throw new Error('Failed to delete comment');
			const updatedComments = comments.filter((comment) => comment.id !== id);
			setComments(updatedComments);
			setPost({ ...post, comments: updatedComments });
		} catch (err) {
			console.error(err);
		}
	};

	const handleDeletePost = async (id) => {
		const confirmDelete = window.confirm(
			'Are you sure you want to delete this post?'
		);
		if (!confirmDelete) return;

		try {
			const res = await apiFetch(
				`${API_URL}/admin/${user.id}/posts/${post.id}`,
				{
					method: 'DELETE',
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (!res.ok) throw new Error('Failed to delete post');
			navigate(`/admin/${user.id}/posts`);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		apiFetch(`${API_URL}/posts/${id}`)
			.then((res) => res.json())
			.then((json) => {
				const postData = { ...json.data, comments: json.data.comments || [] };
				setPost(postData);
				setOriginalPost(postData);
			});
	}, [id]);

	useEffect(() => {
		if (!post || !originalPost) return;

		const titleChanged = post.title !== originalPost.title;
		const contentChanged = post.content !== originalPost.content;
		const commentCountChanged =
			comments.length !== (originalPost.comments?.length || 0);

		setIsChanged(titleChanged || contentChanged || commentCountChanged);
	}, [post, comments, originalPost]);

	useEffect(() => {
		apiFetch(`${API_URL}/posts/${id}`)
			.then((res) => res.json())
			.then((json) => setPost(json.data));
	}, [id]);

	useEffect(() => {
		fetchComments();
	}, [id]);

	if (!post) return <p>Loading...</p>;

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await apiFetch(`${API_URL}/admin/${user.id}/posts/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
				body: JSON.stringify({
					title: post.title,
					content: post.content,
				}),
			});

			if (!res.ok) throw new Error('Failed to update post');
			navigate(`/admin/${user.id}/posts/${id}`);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<Box>
			<form onSubmit={handleSubmit} style={{ width: '800px' }}>
				<Container mb="lg">
					<Paper radius="lg" shadow="xl" p="xl">
						<Stack gap="lg">
							<Group justify="space-between">
								<Input
									autoFocus
									color="black"
									required
									value={post.title}
									styles={{
										input: { fontSize: '34px', fontWeight: 700 },
									}}
									onChange={(e) => {
										setPost({ ...post, title: e.target.value });
									}}
								></Input>
								<Button variant="light" color="red" onClick={handleDeletePost}>
									Delete Post
								</Button>
							</Group>
							<Textarea
								autosize
								size="md"
								value={post.content}
								onChange={(e) => {
									setPost({ ...post, content: e.target.value });
								}}
							></Textarea>
							<Paper bg="gray.1" radius="lg" shadow="sm" p="xl" mb="lg">
								<Title order={4}>
									{comments.length}{' '}
									{comments.length === 1 ? 'Comment' : 'Comments'}
								</Title>
								{comments.length === 0 ? (
									''
								) : (
									<Paper bg="white" mt="md" shadow="sm" p="md" radius="md">
										<Stack>
											{comments.map((c) => (
												<Comment
													key={c.id}
													comment={c}
													edit
													handleDelete={handleDeleteComment}
												/>
											))}
										</Stack>
									</Paper>
								)}
							</Paper>
						</Stack>
						<Button
							radius="md"
							type="submit"
							disabled={!isChanged}
							sx={{
								backgroundColor: isChanged ? '#2e949f' : '#ccc',
								color: 'white',
								cursor: isChanged ? 'pointer' : 'not-allowed',
								transition: 'background-color 0.2s ease',
								'&:hover': {
									backgroundColor: isChanged ? '#277d88' : '#ccc',
								},
							}}
						>
							Save Changes
						</Button>
						<Button
							mx="md"
							variant="outline"
							color="gray"
							radius="md"
							onClick={() => navigate(-1)}
						>
							Cancel
						</Button>
					</Paper>
				</Container>
			</form>
		</Box>
	);
}

export default EditPost;
