import { Outlet, Link } from 'react-router-dom';
import { Button, Box, Container } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useAuth } from '../auth/AuthProvider';

export default function DetailsLayout() {
	const { user } = useAuth();
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
