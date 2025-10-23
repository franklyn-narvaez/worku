import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function AuthLayout() {
	return (
		<>
			<Navbar />
			<Outlet />
		</>
	);
}

export default AuthLayout;
