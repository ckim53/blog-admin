import { Outlet } from 'react-router-dom';
import './layout.css';

export default function Layout() {
	return (
		<div className="layout">
			<main className="main">
				<Outlet />
			</main>
		</div>
	);
}
