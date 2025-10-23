import { useNavigate } from 'react-router-dom';
import UserTable from '../components/UserTable';

export default function Users() {
	const navigate = useNavigate();
	const handleNavigate = () => {
		navigate('/admin/users/create');
	};
	return (
		<div className="p-6 gap-4">
			<div className="flex justify-between items-center pb-2">
				<button
					type="button"
					onClick={handleNavigate}
					className="bg-black text-white px-2 py-1.5 rounded-md hover:bg-gray-800 transition"
				>
					Crear usuario
				</button>
			</div>
			<UserTable />
		</div>
	);
}
