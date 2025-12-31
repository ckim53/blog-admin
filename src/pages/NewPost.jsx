import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../services/api';
import { useApiFetch } from '../services/apiFetch';
import { useAuth } from '../auth/AuthProvider';

import {
	Input,
	Group,
	Button,
	Container,
	Paper,
	Switch,
	Stack,
	Textarea,
	Box,
} from '@mantine/core';

function NewPost() {
	const { id } = useParams();
	const [post, setPost] = useState({ title: '', content: '', published: true });
	const apiFetch = useApiFetch();
	const navigate = useNavigate();
	const { user } = useAuth();
	const token = localStorage.getItem('token');

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await apiFetch(`${API_URL}/admin/${user.id}/posts`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					title: post.title,
					content: post.content,
					published: post.published,
				}),
			});

			if (!res.ok) throw new Error('Failed to create post');
			const json = await res.json();
			navigate(`/admin/${user.id}/posts/${json.data.id}`);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<Box w="60%" px="md">
			<Paper radius="lg" shadow="xl" p="xl">
				<Stack gap="lg">
					<Group justify="space-between">
						<Input
							autoFocus
							color="black"
							placeholder={'Title'}
							required
							styles={{
								input: { fontSize: '34px', fontWeight: 700 },
							}}
							onChange={(e) => {
								setPost({ ...post, title: e.target.value });
							}}
						></Input>
						<Switch
							size="md"
							defaultChecked
							label="Publish"
							onChange={(e) => {
								setPost({ ...post, published: e.currentTarget.checked });
							}}
						/>
					</Group>
					<Textarea
						required
						autosize
						minRows={4}
						maxRows={12}
						placeholder="Content"
						size="lg"
						onChange={(e) => setPost({ ...post, content: e.target.value })}
					/>
				</Stack>
				<Group mt="lg">
					<Button size="md" radius="md" type="submit" onClick={handleSubmit}>
						Create Post
					</Button>
					<Button
						size="md"
						m="md"
						variant="outline"
						color="gray"
						radius="md"
						onClick={() => navigate(-1)}
					>
						Cancel
					</Button>
				</Group>
			</Paper>
		</Box>
	);
}

export default NewPost;
