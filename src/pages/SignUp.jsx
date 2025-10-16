import { useState } from 'react';
import './home.css';
export default function SignUp() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirmation, setPasswordConfirmation] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await fetch('http://localhost:3000/sign-up', {
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
		<form onSubmit={handleSubmit}>
			<h1 id="sign-up">Sign Up</h1>
			{error && <p style={{ color: 'red' }}>{error}</p>}
			{success && <p style={{ color: 'green' }}>{success}</p>}
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
			<input
				type="password"
				placeholder="Confirm Password"
				value={passwordConfirmation}
				onChange={(e) => setPasswordConfirmation(e.target.value)}
			/>
			<br />
			<button type="submit">Sign Up</button>
		</form>
	);
}
