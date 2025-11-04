import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { USER_UPDATE } from '@/constants/path';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react'
import { statusLabels } from '../schemas/Update';
import type { ExtendedUser } from '../types/user';
import { NotebookText, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button';
import UserModal from './UserDetails';
import TablePagination from '@/components/TablePagination';

const UserTable = (props: { users: ExtendedUser[] }) => {
	const navigate = useNavigate();
	const [selectedUser, setSelectedUser] = useState<ExtendedUser | null>(null)
	const [openModal, setOpenModal] = useState(false)

	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 10
	const totalPages = Math.ceil(props.users.length / itemsPerPage)
	const startIndex = (currentPage - 1) * itemsPerPage
	const currentUsers = props.users.slice(startIndex, startIndex + itemsPerPage)

	const handleEdit = (id: string) => {
		navigate(USER_UPDATE.replace(':id', id));
	};

	const handleView = (user: ExtendedUser) => {
		setSelectedUser(user)
		setOpenModal(true)
	}

	return (
		<>
			<Table>
				<TableHeader className="bg-header-table">
					<TableRow>
						<TableHead>Nombre</TableHead>
						<TableHead>Apellido</TableHead>
						<TableHead>Correo</TableHead>
						<TableHead>Rol</TableHead>
						<TableHead>Escuela</TableHead>
						<TableHead>Fecha de creacion</TableHead>
						<TableHead>Estado</TableHead>
						<TableHead>Acciones</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{currentUsers.map(user => (
						<TableRow key={user.id} className="bg-white border-b hover:bg-gray-300">
							<TableCell className="p-4">{user.name}</TableCell>
							<TableCell className="p-4">{user.lastName}</TableCell>
							<TableCell className="p-4">{user.email}</TableCell>
							<TableCell className="p-4">{user.role?.name ?? 'Sin rol'}</TableCell>
							<TableCell className="p-4">{user.college?.name ?? 'Sin escuela'}</TableCell>
							<TableCell className="p-4">{new Date(user.createdDate).toLocaleDateString()}</TableCell>
							<TableCell className="p-4">
								<Badge variant={user.status === 'ACTIVE' ? 'success' : 'destructive'}>
									{statusLabels[user.status]}
								</Badge>
							</TableCell>
							<TableCell className="p-4 text-right flex  space-x-2">
								<Button
									variant="outline"
									size="sm"
									className="text-gray-600 border-blue-200 hover:bg-gray-100 hover:text-black"
									onClick={() => handleEdit(user.id)}
								>
									<Edit className="w-4 h-4 mr-2" />
									Editar
								</Button>

								<Button
									variant="outline"
									size="sm"
									className="text-gray-600 border-blue-200 hover:bg-gray-100 hover:text-black"
									onClick={() => handleView(user)}
								>
									<NotebookText className="w-4 h-4 mr-2" />
									Detalles
								</Button>
							</TableCell>

						</TableRow>
					))}
				</TableBody>
				<UserModal open={openModal} onClose={() => setOpenModal(false)} user={selectedUser} />
			</Table>

			<div className="mt-4">
				<TablePagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={setCurrentPage}
				/>
			</div>
		</>
	);
};

export default UserTable;
