import { Link } from 'react-router-dom';
import { Paper, Title, Text, Button } from '@mantine/core';
import './home.css';

function Home() {
	return (
		<div className="home">
			<nav id="description"></nav>
			<div className="welcome-container">
				<Paper
					className="welcome-paper"
					shadow="xl"
					radius="lg"
					p="xl"
					withBorder
				>
					<Title id="welcome-title" order={2} ta="center" mb="sm">
						Welcome to Coffee Break ☕
					</Title>
					<Text id="welcome-description" c="dimmed" ta="center">
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
			</div>
		</div>
	);
}

export default Home;
