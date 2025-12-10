import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PostDetails from './pages/PostDetails';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Layout from './components/Layout';
import DetailsLayout from './components/DetailsLayout';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './auth/AuthProvider';
import EditPost from './pages/EditPost';
import NewPost from './pages/NewPost';

function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					<Route element={<Layout />}>
						<Route path="/" element={<Home />} />
						<Route path="/log-in" element={<Login />} />
						<Route path="/sign-up" element={<SignUp />} />
					</Route>
					<Route path="/admin/:authorId/posts" element={<Layout />}>
						<Route index element={<Dashboard />} />
						<Route path="new" element={<NewPost />} />
						<Route path=":id" element={<DetailsLayout />}>
							<Route index element={<PostDetails />} />
							<Route path="edit" element={<EditPost />} />
						</Route>
					</Route>
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}

export default App;
