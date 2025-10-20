import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PostDetails from './pages/PostDetails';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<Layout />}>
					<Route path="/" element={<Home />} />
					<Route path="/admin/:authorId/posts" element={<Dashboard />} />
					<Route path="/admin/:authorId/posts/:id" element={<PostDetails />} />
					<Route path="/log-in" element={<Login />} />
					<Route path="/sign-up" element={<SignUp />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
