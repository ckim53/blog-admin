import React from 'react';
import { useParams } from 'react-router-dom';
import { getPostsFromAuthor } from '../services/api';
import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import './home.css';
import PostCard from '../components/PostCard';

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
		<div className="home">
			<div className="welcome-title">Welcome, @{user?.username}</div>
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
