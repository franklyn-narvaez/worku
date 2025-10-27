import { useNavigate } from 'react-router-dom';
import UserTable from '../components/UserTable';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import type { ExtendedUser } from '../types/user';

export default function Users() {
	const navigate = useNavigate();
	const { createAuthFetchOptions } = useAuth();
	const [users, setUsers] = useState<ExtendedUser[] | undefined>(undefined);

	useEffect(() => {
		const fetchUsers = async () => {
			const fetchOptions = await createAuthFetchOptions();
			const res = await fetch('http://localhost:3000/api/user', fetchOptions);
			const data = await res.json();
			setUsers(data);
		};
		fetchUsers();
	}, [createAuthFetchOptions]);

	const handleNavigate = () => {
		navigate('/admin/users/create');
	};

	if (!users) {
		return <div>Loading...</div>;
	}

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
			<UserTable users={users} />
		</div>
	);
}
