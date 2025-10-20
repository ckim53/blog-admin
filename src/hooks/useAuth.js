import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export default function useAuth() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState(null);

	const applyToken = (token) => {
		try {
			const decoded = jwtDecode(token);
			if (decoded.exp * 1000 > Date.now()) {
				setIsAuthenticated(true);
				setUser(decoded);
			} else {
				logout();
			}
		} catch {
			logout();
		}
	};

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) applyToken(token);

		const handleAuthChange = () => {
			const t = localStorage.getItem('token');
			if (t) applyToken(t);
			else {
				setIsAuthenticated(false);
				setUser(null);
			}
		};

		window.addEventListener('authChange', handleAuthChange);
		window.addEventListener('storage', handleAuthChange);
		return () => {
			window.removeEventListener('authChange', handleAuthChange);
			window.removeEventListener('storage', handleAuthChange);
		};
	}, []);

	const login = (data) => {
		localStorage.setItem('userId', data.user.id);
		localStorage.setItem('username', data.user.username);
		localStorage.setItem('token', data.token);
		applyToken(data.token);
		window.dispatchEvent(new Event('authChange'));
	};

	const logout = () => {
		localStorage.removeItem('token');
		setIsAuthenticated(false);
		setUser(null);
		window.dispatchEvent(new Event('authChange'));
	};

	return { isAuthenticated, user, login, logout };
}
