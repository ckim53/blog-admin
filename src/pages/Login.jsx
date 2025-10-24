import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button, Text, Group, Title, Input } from '@mantine/core';
import { useAuth } from '../auth/AuthProvider';

export default function Login() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const { login } = useAuth();

	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');

		try {
			const res = await fetch('http://localhost:3000/log-in', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password }),
			});

			const data = await res.json();

			if (res.ok && data.ok) {
				login(data);
				setError('');
				window.dispatchEvent(new Event('authChange'));
				navigate(`/admin/${data.user.id}/posts`);
			} else {
				setError(data.error || 'Login failed. Please try again.');
			}
		} catch (err) {
			console.log(err);
			setError('Could not connect to server. Please try again later.');
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<Text c="white" td="none" ta="center">
				<Title order={1}>Login</Title>
				<Title order={2}>
					<Group my="10px" justify="center">
						<Text size="lg">Don't have an account?</Text>
						<Text
							size="lg"
							component={Link}
							to="/sign-up"
							style={{
								color: 'white',
								textDecoration: 'none',
								fontWeight: 'bold',
							}}
						>
							Sign Up
						</Text>
					</Group>
				</Title>
				{error &&
					error.split(';').map((msg, i) => (
						<p key={i} style={{ color: 'red', margin: 0 }}>
							{msg.trim()}
						</p>
					))}
				<Input
					my="lg"
					size="md"
					radius="md"
					type="text"
					placeholder="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				></Input>
				<Input
					my="lg"
					size="md"
					radius="md"
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				></Input>
				<Button
					type="submit"
					style={{ backgroundColor: '#2e949f' }}
					size="lg"
					p="sm"
					radius="md"
					mt="md"
				>
					Log In
				</Button>
			</Text>
		</form>
	);
}
