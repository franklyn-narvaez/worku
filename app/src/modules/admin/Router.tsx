import { Route, Routes } from 'react-router-dom';
import Users from './pages/Users';
import UserUpdate from './pages/UserUpdate';
import { CREATE } from '@/constants/path';
import UserCreate from './pages/UserCreate';

function AdminRouter() {
	return (
		<Routes>
			<Route path="" element={<Users />} />
			<Route path={CREATE} element={<UserCreate />} />
			<Route path="update/:id" element={<UserUpdate />} />
			<Route path="*" element={<div>Not Found</div>} />
		</Routes>
	);
}

export default AdminRouter;
