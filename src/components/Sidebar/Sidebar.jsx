import { Link, useNavigate } from 'react-router-dom';
import './sidebar.css';
import { TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import useAuth from '../../hooks/useAuth';

export default function Sidebar() {
	const navigate = useNavigate();
	const { isAuthenticated, user, logout } = useAuth();

	const handleLogout = () => {
		logout();
		navigate('/');
	};

	const getAdminHome = () => {
		navigate(`/admin/${user.id}/posts`);
	};

	return (
		<div className="sidebar">
			{isAuthenticated ? (
				<Link className="logo" onClick={getAdminHome}>
					My Blog
				</Link>
			) : (
				<Link className="logo" to="/">
					My Blog
				</Link>
			)}

			<nav>
				<TextInput
					placeholder="Search..."
					icon={<IconSearch size={20} />}
					size="md"
					radius="md"
				/>
				{isAuthenticated ? (
					<ul>
						<li>
							<button onClick={handleLogout}>Log Out</button>
						</li>
					</ul>
				) : (
					<ul>
						<li>
							<Link to="/log-in">Log In</Link>
						</li>
						<li>
							<Link to="/sign-up">Sign Up</Link>
						</li>
					</ul>
				)}
			</nav>
		</div>
	);
}
