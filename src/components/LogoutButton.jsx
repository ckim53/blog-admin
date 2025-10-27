import { Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('userId');
		navigate('/');
	};

	return (
		<Button
			onClick={handleLogout}
			color="white"
			variant="subtle"
			radius="md"
			size="lg"
			style={{ position: 'absolute', top: '55px', right: '50px' }}
		>
			Log Out
		</Button>
	);
}

export default LogoutButton;
