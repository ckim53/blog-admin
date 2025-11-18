import { Link, useNavigate } from 'react-router-dom';
import { Paper, Title, Text, Button, Box, Group } from '@mantine/core';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { API_URL } from '../services/api';
import { useAuth } from '../auth/AuthProvider';

function Home() {
	const navigate = useNavigate();
	const { login } = useAuth();

	const handleDemo = async (e) => {
		e.preventDefault();

		try {
			const res = await fetch(`${API_URL}/demo`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ guest: true }),
			});

			const data = await res.json();

			if (res.ok && data.ok) {
				login(data);
				window.dispatchEvent(new Event('authChange'));
				navigate(`/admin/${data.user.id}/posts`);
			}
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		const userId = localStorage.getItem('userId');
		const token = localStorage.getItem('token');
		if (!token || !userId) return;

		try {
			const raw = token.startsWith('Bearer ') ? token.slice(7) : token;
			const decoded = jwtDecode(raw);
			const isExpired = decoded.exp * 1000 < Date.now();

			if (!isExpired) {
				navigate(`/admin/${userId}/posts`, { replace: true });
			} else {
				localStorage.removeItem('token');
			}
		} catch (err) {
			console.error('Invalid token:', err);
			localStorage.removeItem('token');
		}
	}, [navigate]);
	return (
		<Box
			style={{
				display: 'flex',
				justifyContent: 'center',
				marginTop: '20px',
			}}
		>
			<Paper
				shadow="xl"
				radius="lg"
				p="xl"
				withBorder
				style={{
					width: '800px',
					height: '350px',
					maxWidth: '90%',
					textAlign: 'center',
				}}
			>
				<Title
					order={2}
					ta="center"
					mb="sm"
					style={{ color: ' #6f4e37', fontSize: '40px' }}
				>
					Welcome to Coffee Break ☕
				</Title>
				<Text c="dimmed" ta="center" style={{ fontSize: '20px' }}>
					A space to slow down, reflect, and share thoughts—one sip at a time.
				</Text>
				<Group justify="center">
					<Button
						style={{ backgroundColor: '#2e949f' }}
						size="lg"
						p="sm"
						radius="md"
						mt="md"
						component={Link}
						to="/sign-up"
					>
						Sign Up
					</Button>
				</Group>
				<Button
					style={{ backgroundColor: '#2e949f' }}
					size="lg"
					p="sm"
					radius="md"
					mt="md"
					onClick={handleDemo}
				>
					Guest User
				</Button>
			</Paper>
		</Box>
	);
}

export default Home;
