import { Link } from 'react-router-dom';
import { Paper, Title, Text, Button, Box } from '@mantine/core';

function Home() {
	return (
		<div className="home">
			<Box
				style={{
					display: 'flex',
					justifyContent: 'center',
					marginTop: '20px',
				}}
			>
				<Paper
					shadow="xl"
					radius="lg"
					p="xl"
					withBorder
					style={{
						width: '800px',
						height: '350px',
						maxWidth: '90%',
						textAlign: 'center',
					}}
				>
					<Title
						order={2}
						ta="center"
						mb="sm"
						style={{ color: ' #6f4e37', fontSize: '40px' }}
					>
						Welcome to Coffee Break ☕
					</Title>
					<Text c="dimmed" ta="center" style={{ fontSize: '20px' }}>
						A space to slow down, reflect, and share thoughts—one sip at a time.
					</Text>
					<Button
						style={{ backgroundColor: '#2e949f' }}
						size="lg"
						p="sm"
						radius="md"
						mt="lg"
						component={Link}
						to="/log-in"
					>
						Log In
					</Button>
					<br />
					<Button
						style={{ backgroundColor: '#2e949f' }}
						size="lg"
						p="sm"
						radius="md"
						mt="md"
						component={Link}
						to="/sign-up"
					>
						Sign Up
					</Button>
				</Paper>
			</Box>
		</div>
	);
}

export default Home;
