import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import { Text, Box, Button, Group } from '@mantine/core';
import { useAuth } from '../auth/AuthProvider';
import { useApiFetch } from '../services/apiFetch';
import { API_URL } from '../services/api';
import { IconLibraryPlus, IconCoffee } from '@tabler/icons-react';
import LogoutButton from '../components/LogoutButton';

function Dashboard() {
	const { authorId } = useParams();
	const [posts, setPosts] = useState([]);
	const { user } = useAuth();
	const apiFetch = useApiFetch();
	const navigate = useNavigate();

	const handleNewPost = () => {
		navigate(`/admin/${user.id}/posts/new`);
	};

	useEffect(() => {
		apiFetch(`${API_URL}/admin/${authorId}/posts`, {
			headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
		})
			.then((res) => res.json())
			.then((json) => setPosts(json.data))
			.catch((err) => console.error(err));
	}, []);

	useEffect(() => {}, [user]);

	return (
		<Box px={50}>
			<Group mt={10} mb={30}>
				<Text
					mb={20}
					style={{
						color: 'white',
						fontSize: '40px',
						fontWeight: 'bold',
					}}
				>
					My Dashboard{' '}
				</Text>
				<IconCoffee
					style={{
						marginBottom: '25px',
						color: 'white',
					}}
					size={45}
				></IconCoffee>
				<Button
					onClick={handleNewPost}
					radius="md"
					size="md"
					mb="lg"
					mx="lg"
					leftSection={<IconLibraryPlus></IconLibraryPlus>}
				>
					New Post
				</Button>
				<LogoutButton />
			</Group>
			<Box className="posts-grid">
				{posts.map((p) => (
					<PostCard key={p.id} post={p} />
				))}
			</Box>
		</Box>
	);
}

export default Dashboard;
