import { Button, Box, Title, Input, Text } from '@mantine/core';
import { useState } from 'react';
import { API_URL } from '../services/api';
import { Link } from 'react-router-dom';

export default function SignUp() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirmation, setPasswordConfirmation] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await fetch(`${API_URL}/sign-up`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password, passwordConfirmation }),
			});
			const data = await res.json();
			if (res.ok && data.ok) {
				setSuccess('Account created! You can log in now.');
				setError('');
			}
			if (!res.ok) {
				if (data.errors) {
					setError(
						Object.values(data.errors)
							.map((e) => e.msg)
							.join('; ')
					);
				} else {
					setError(data.error || 'Sign up failed');
				}
			}
		} catch (err) {
			setError('Something went wrong');
		}
	};

	return (
		<Box
			mih="100vh"
			bg="#0b1e36"
			style={{
				display: 'flex',
				justifyContent: 'center',
				overflowY: 'auto',
			}}
		>
			<Box ta="center" mt={30} pt={40} pb={40}>
				<form onSubmit={handleSubmit}>
					<Title mb="20px" order={1} c="white" td="none">
						Sign Up
					</Title>

					{error &&
						error.split(';').map((msg, i) => (
							<p key={i} style={{ color: 'red', margin: 0 }}>
								{msg.trim()}
							</p>
						))}
					{success && <p style={{ color: 'green' }}>{success}</p>}

					<Input
						my="lg"
						size="md"
						radius="md"
						type="text"
						placeholder="Username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
					<Input
						my="lg"
						size="md"
						radius="md"
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<Input
						my="lg"
						size="md"
						radius="md"
						type="password"
						placeholder="Confirm Password"
						value={passwordConfirmation}
						onChange={(e) => setPasswordConfirmation(e.target.value)}
					/>
					<Button
						type="submit"
						style={{ backgroundColor: '#2e949f' }}
						size="lg"
						p="sm"
						radius="md"
						my="md"
					>
						Sign Up
					</Button>
				</form>

				<Title
					td="none"
					component={Link}
					to="/"
					c="white"
					fw={700}
					order={5}
					mt="lg"
				>
					Back to Home
				</Title>
			</Box>
		</Box>
	);
}
