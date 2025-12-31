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
		<Box className="details-layout" pos="relative" mih="100vh" p="md" pb="xl">
			<Button
				size="md"
				m="lg"
				radius="md"
				leftSection={<IconArrowLeft size={15} />}
				component={Link}
				to={`/admin/${user.id}/posts`}
				styles={{
					root: {
						backgroundColor: 'steelblue',
						width: 'fit-content',
					},
				}}
			>
				Back to Dashboard
			</Button>
			<Box pt="lg" pb="xl" px="15rem">
				<Outlet />
			</Box>
		</Box>
	);
}
