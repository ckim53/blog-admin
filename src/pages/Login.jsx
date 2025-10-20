import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import './home.css';
import { Button } from '@mantine/core';

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
			<div className="log-in">
				<h1>Login</h1>
				<h3>
					Don't have an account?
					<Link to="/sign-up" style={{ marginLeft: '0.5rem' }}>
						<strong id="sign-up">Sign Up</strong>
					</Link>
				</h3>
				{error && <p style={{ color: 'red' }}>{error}</p>}
				<input
					type="text"
					placeholder="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<br />
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<br />
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
			</div>
		</form>
	);
}
