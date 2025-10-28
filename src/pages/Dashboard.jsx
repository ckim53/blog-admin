import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import { Text, Box, Button, Group, Select } from '@mantine/core';
import { useAuth } from '../auth/AuthProvider';
import { useApiFetch } from '../services/apiFetch';
import { API_URL } from '../services/api';
import { IconLibraryPlus, IconCoffee } from '@tabler/icons-react';
import LogoutButton from '../components/LogoutButton';

function Dashboard() {
	const { authorId } = useParams();
	const [posts, setPosts] = useState([]);
	const [sortBy, setSortBy] = useState('date');
	const { user } = useAuth();
	const apiFetch = useApiFetch();
	const navigate = useNavigate();

	const handleNewPost = () => {
		navigate(`/admin/${user.id}/posts/new`);
	};

	const sortedPosts = [...posts].sort((a, b) => {
		if (sortBy === 'name') return a.title.localeCompare(b.title);
		if (sortBy === 'date') return new Date(b.createdAt) - new Date(a.createdAt);
		if (sortBy === 'status')
			return b.published === a.published ? 0 : b.published ? 1 : -1;
		return 0;
	});

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
			<Group mt={10}>
				<Text
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
						marginBottom: '10px',
						color: 'white',
					}}
					size={45}
				></IconCoffee>
				<Button
					onClick={handleNewPost}
					radius="md"
					size="md"
					mx="lg"
					leftSection={<IconLibraryPlus></IconLibraryPlus>}
				>
					New Post
				</Button>

				<LogoutButton />
			</Group>
			<Select
			shadow="xs"
				size="md"
				value={sortBy}
				onChange={setSortBy}
				c="white"
				data={[
					{ value: 'date', label: 'Date Added (Newest First)' },
					{ value: 'name', label: 'Title' },
				]}
				label="Sort By"
				maw={250}
				my="xl"
			/>
			<Box className="posts-grid">
				{sortedPosts.map((p) => (
					<PostCard key={p.id} post={p} />
				))}
			</Box>
		</Box>
	);
}

export default Dashboard;
