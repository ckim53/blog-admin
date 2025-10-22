import React from 'react';
import { useParams } from 'react-router-dom';
import { getPostsFromAuthor } from '../services/api';
import { useState, useEffect } from 'react';
import './dashboard.css';
import PostCard from '../components/PostCard';
import { Text } from '@mantine/core';
import { useAuth } from '../auth/AuthProvider';

function Dashboard() {
	const { authorId } = useParams();
	const [posts, setPosts] = useState([]);
	const { user } = useAuth();

	useEffect(() => {
		getPostsFromAuthor(authorId)
			.then((data) => setPosts(data))
			.catch((err) => console.error(err));
	}, []);

	useEffect(() => {}, [user]);

	return (
		<div className="dashboard">
			<Text
				styles={{
					root: { color: 'white', fontSize: '40px', fontWeight: 'bold' },
				}}
				className="welcome-title"
			>
				My Dashboard
			</Text>
			<nav id="description"></nav>
			<div className="posts-grid">
				{posts.map((p) => (
					<PostCard key={p.id} post={p} />
				))}
			</div>
		</div>
	);
}

export default Dashboard;
