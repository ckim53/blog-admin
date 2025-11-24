import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import {
	Text,
	Box,
	Button,
	Group,
	SegmentedControl,
	Flex,
	Loader,
	Center,
} from '@mantine/core';
import { useAuth } from '../auth/AuthProvider';
import { useApiFetch } from '../services/apiFetch';
import { API_URL } from '../services/api';
import { IconLibraryPlus, IconCoffee } from '@tabler/icons-react';
import LogoutButton from '../components/LogoutButton';
import { Link } from 'react-router-dom';

function Dashboard() {
	const { authorId } = useParams();
	const [posts, setPosts] = useState([]);
	const [filter, setFilter] = useState('all');
	const { user, loadingAuth } = useAuth();
	const apiFetch = useApiFetch();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => setLoading(false), 300);
		return () => clearTimeout(timer);
	}, []);

	const handleNewPost = () => {
		navigate(`/admin/${user.id}/posts/new`);
	};

	const filteredPosts = posts.filter((post) => {
		if (filter === 'published') return post.published;
		if (filter === 'unpublished') return !post.published;
		return true;
	});

	const data = [
		{ label: 'All', value: 'all' },
		{ label: 'Published', value: 'published' },
		{ label: 'Unpublished', value: 'unpublished' },
	];

	// useEffect(() => {
	// 	apiFetch(`${API_URL}/admin/${authorId}/posts`, {
	// 		headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
	// 	})
	// 		.then((res) => res.json())
	// 		.then((json) => setPosts(json.data))
	// 		.catch((err) => console.error(err));
	// }, []);

	useEffect(() => {
		if (!user || loadingAuth) return;

		apiFetch(`${API_URL}/admin/${user.id}/posts`, {
			headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
		})
			.then((res) => res.json())
			.then((json) => setPosts(json.data))
			.catch((err) => console.error(err));
	}, [user, loadingAuth]);

	if (loading || loadingAuth) {
		return (
			<Center mt={200}>
				<Loader color="blue" />
			</Center>
		);
	}

	if (!user) {
		return navigate('/');
	}

	return (
		<Flex direction="column" px={50} mt={10} justify="center">
			<Group>
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
						color: '#BF94E4',
					}}
					size={45}
				></IconCoffee>
				<Button
					onClick={handleNewPost}
					radius="md"
					size="md"
					mx="md"
					leftSection={<IconLibraryPlus></IconLibraryPlus>}
				>
					New Post
				</Button>
				<Button
					component={Link}
					to="https://coffee-break.up.railway.app"
					radius="md"
					size="md"
				>
					Public Feed
				</Button>
				<LogoutButton />
			</Group>
			<Group>
				<SegmentedControl
					radius="md"
					mt={20}
					color="teal"
					data={data}
					onChange={setFilter}
				/>
			</Group>

			{filteredPosts.length > 0 ? (
				<Box className="posts-grid" mt="xl" w="93vw">
					{filteredPosts.map((p) => (
						<PostCard key={p.id} post={p} />
					))}
				</Box>
			) : (
				<Box className="posts-grid" mt="xl" w="93vw">
					<Text
						c="dimmed"
						m="xs"
						ta="left"
						size="xl"
						style={{ gridColumn: '1 / -1' }}
					>
						No posts yet ☕
					</Text>
				</Box>
			)}
		</Flex>
	);
}

export default Dashboard;
