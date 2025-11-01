'use client';

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { DIRECTOR_HISTORY_PROFILE, REVIEW_PROFILE_HISTORY } from '@/constants/path';
import { useNavigate } from 'react-router-dom';

type StudentProfile = {
	id: string;
	fullName: string;
	studentCode: string;
	planName: string;
	status: 'APPROVED' | 'REJECTED';
	reviewedAt: string;
	submittedAt: string;
	Photo?: string | null;
	Grades?: string | null;
	user: {
		email: string;
	};
};

const ReviewProfileHistory = () => {
	const { createAuthFetchOptions } = useAuth();
	const [profiles, setProfiles] = useState<StudentProfile[]>([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	const fetchProfiles = async () => {
		try {
			setLoading(true);
			const fetchOptions = await createAuthFetchOptions();
			const res = await fetch(`${REVIEW_PROFILE_HISTORY}`, fetchOptions);
			if (!res.ok) throw new Error('Error al cargar el historial de perfiles.');
			const data = await res.json();
			setProfiles(data);
		} catch (error) {
			console.error('Error al obtener historial de perfiles:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchProfiles();
	}, []);

	const handleViewProfile = (id: string) => {
		navigate(DIRECTOR_HISTORY_PROFILE.replace(':id', id));
	};

	if (loading) return <p className="text-center py-6">Cargando historial...</p>;

	if (profiles.length === 0) return <p className="text-center py-6 text-gray-600">No hay perfiles revisados aún.</p>;

	return (
		<div className='pt-8 pr-8'>
			<div className="bg-white shadow-md rounded-lg overflow-hidden">
				<Table>
					<TableCaption>Historial de perfiles revisados</TableCaption>
					<TableHeader className="bg-table-header">
						<TableRow>
							<TableHead>Foto</TableHead>
							<TableHead>Nombre</TableHead>
							<TableHead>Código</TableHead>
							<TableHead>Programa</TableHead>
							<TableHead>Correo</TableHead>
							<TableHead>Fecha envío</TableHead>
							<TableHead>Estado</TableHead>
							<TableHead>Fecha revisión</TableHead>
							<TableHead>Acciones</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{profiles.map(profile => (
							<TableRow key={profile.id} className="hover:bg-slate-50">
								<TableCell>
									{profile.Photo ? (
										<img src={profile.Photo} alt="Foto estudiante" className="w-12 h-12 object-cover rounded-full border" />
									) : (
										<div className="w-12 h-12 bg-gray-200 rounded-full" />
									)}
								</TableCell>

								<TableCell className="font-medium">{profile.fullName}</TableCell>
								<TableCell>{profile.studentCode}</TableCell>
								<TableCell>{profile.planName}</TableCell>
								<TableCell>{profile.user.email}</TableCell>

								<TableCell>
									{profile.submittedAt
										? new Date(profile.submittedAt).toLocaleDateString('es-CO', {
											year: 'numeric',
											month: 'short',
											day: 'numeric',
										})
										: 'Sin fecha de envío'}
								</TableCell>

								<TableCell>
									<span
										className={`px-2 py-1 rounded text-white text-xs font-medium ${profile.status === 'APPROVED' ? 'bg-green-500' : 'bg-red-500'
											}`}
									>
										{profile.status === 'APPROVED' ? 'Aprobado' : 'Rechazado'}
									</span>
								</TableCell>

								<TableCell>
									{profile.reviewedAt
										? new Date(profile.reviewedAt).toLocaleDateString('es-CO', {
											year: 'numeric',
											month: 'short',
											day: 'numeric',
										})
										: 'Sin fecha de revisión'}
								</TableCell>

								<TableCell>
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleViewProfile(profile.id)}
										className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
									>
										Ver detalles
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div >
	)
};

export default ReviewProfileHistory;
