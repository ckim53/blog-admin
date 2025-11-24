import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
	const init = () => {
		const t = localStorage.getItem('token');
		if (!t) return { isAuthenticated: false, user: null, token: null };
		try {
			const raw = t.startsWith('Bearer ') ? t.slice(7) : t;
			const decoded = jwtDecode(raw);
			if (decoded.exp * 1000 > Date.now()) {
				return { isAuthenticated: true, user: decoded, token: t };
			}
		} catch {}
		return { isAuthenticated: false, user: null, token: null };
	};

	const [state, setState] = useState(init);
	const [loadingAuth, setLoadingAuth] = useState(true);

	useEffect(() => {
		setLoadingAuth(false);
	}, []);

	const applyToken = (token) => {
		try {
			const raw = token.startsWith('Bearer ') ? token.slice(7) : token;
			const decoded = jwtDecode(raw);
			if (decoded.exp * 1000 > Date.now()) {
				setState({ isAuthenticated: true, user: decoded, token });
			} else {
				logout();
			}
		} catch {
			logout();
		}
	};

	useEffect(() => {
		const onStorage = (e) => {
			if (e.key === 'token') {
				const t = localStorage.getItem('token');
				if (t) applyToken(t);
				else setState({ isAuthenticated: false, user: null, token: null });
			}
		};
		const onAuthChange = () => {
			const t = localStorage.getItem('token');
			if (t) applyToken(t);
			else setState({ isAuthenticated: false, user: null, token: null });
		};
		window.addEventListener('storage', onStorage);
		window.addEventListener('authChange', onAuthChange);
		return () => {
			window.removeEventListener('storage', onStorage);
			window.removeEventListener('authChange', onAuthChange);
		};
	}, []);

	const login = (data) => {
		const token = data.token;
		const userId = data.user?.id ?? data.userId ?? null;
		const username = data.user?.username ?? data.username ?? null;

		if (userId) localStorage.setItem('userId', String(userId));
		if (username) localStorage.setItem('username', String(username));
		localStorage.setItem('token', token);

		applyToken(token);
		window.dispatchEvent(new Event('authChange'));
	};

	const logout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('userId');
		localStorage.removeItem('username');
		setState({ isAuthenticated: false, user: null, token: null });
		window.dispatchEvent(new Event('authChange'));
	};

	const value = useMemo(
		() => ({
			isAuthenticated: state.isAuthenticated,
			user: state.user,
			token: state.token,
			loadingAuth,
			login,
			logout,
			getUserId: () => localStorage.getItem('userId'),
		}),
		[state, loadingAuth]
	);

	return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
	const ctx = useContext(AuthCtx);
	if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
	return ctx;
}
