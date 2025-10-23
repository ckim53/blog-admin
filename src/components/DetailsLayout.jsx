import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Button, Box, Container } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useAuth } from '../auth/AuthProvider';
import { useEffect } from 'react';

export default function DetailsLayout() {
	const { user } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) {
			navigate('/');
			return;
		}
	}, []);

	return (
		<Box className="details-layout" pos="relative" mih="100vh">
			<Button
				size="md"
				m="30px"
				leftSection={<IconArrowLeft size={15} />}
				component={Link}
				to={`/admin/${user.id}/posts`}
				styles={{
					root: {
						backgroundColor: 'steelblue',
						marginLeft: '30px',
						width: 'fit-content',
					},
				}}
			>
				Back to Dashboard
			</Button>
			<Container size="md">
				<Outlet />
			</Container>
		</Box>
	);
}
