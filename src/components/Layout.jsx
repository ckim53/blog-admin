import { Outlet } from 'react-router-dom';
import './Layout.css';
import Sidebar from './Sidebar/Sidebar';

export default function Layout() {
	return (
		<div className="layout">
			<Sidebar />
			<main className="main">
				<Outlet />
			</main>
		</div>
	);
}
