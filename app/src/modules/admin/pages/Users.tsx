import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import UserTable from '../components/UserTable';
import type { ExtendedUser } from '../types/user';

export default function Users() {
	const navigate = useNavigate();
	const { createAuthFetchOptions } = useAuth();
	const [users, setUsers] = useState<ExtendedUser[] | undefined>(undefined);
	const [search, setSearch] = useState('');

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

	const filteredUsers = useMemo(() => {
		const normalize = (text: string) =>
			text
				.toLowerCase()
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '');

		if (!users) return [];

		const query = normalize(search.trim());

		if (!query) return users;

		return users.filter(user => {
			const fullName = normalize(`${user.name} ${user.lastName}`);
			const reverseFullName = normalize(`${user.lastName} ${user.name}`);

			return (
				fullName.includes(query) ||
				reverseFullName.includes(query) ||
				normalize(user.name).includes(query) ||
				normalize(user.lastName).includes(query) ||
				normalize(user.email).includes(query) ||
				normalize(user.role?.name ?? '').includes(query) ||
				normalize(user.college?.name ?? '').includes(query)
			);
		});
	}, [users, search]);

	if (!users) {
		return <LoadingSpinner text="Cargando..." />;
	}

	return (
		<div className="p-6 gap-4">
			<div className="flex justify-between items-center pb-4">
				<button
					type="button"
					onClick={handleNavigate}
					className="bg-button-create text-white px-3 py-2 rounded-md hover:bg-gray-800 transition"
				>
					Crear usuario
				</button>
				<input
					type="text"
					placeholder="Buscar por nombre, correo, rol o escuela..."
					value={search}
					onChange={e => setSearch(e.target.value)}
					className="bg-white border border-blue-300 rounded-md px-3 py-2 w-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<UserTable users={filteredUsers} />
		</div>
	);
}
