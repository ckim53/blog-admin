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
		<App>
			<AuthProvider>
				<BrowserRouter>
					<Routes>
						<Route element={<Layout />}>
							<Route path="/" element={<Home />} />
							<Route path="/admin/:authorId/posts" element={<Dashboard />} />
						</Route>
						<Route element={<DetailsLayout />}>
							<Route
								path="/admin/:authorId/posts/:id"
								element={<PostDetails />}
							/>
							<Route
								path="/admin/:authorId/posts/:id/edit"
								element={<EditPost />}
							/>
							<Route path="/admin/:authorId/posts/new" element={<NewPost />} />
						</Route>
						<Route path="/log-in" element={<Login />} />
						<Route path="/sign-up" element={<SignUp />} />
					</Routes>
				</BrowserRouter>
			</AuthProvider>
		</App>
	);
}

export default App;
