'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DIRECTOR_HISTORY_PROFILE, REVIEW_PROFILE_HISTORY } from '@/constants/path';
import { useAuth } from '@/hooks/useAuth';

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

	if (loading) return <LoadingSpinner text="Cargando perfiles..." />;

	if (profiles.length === 0) return <p className="text-center py-6 text-gray-600">No hay perfiles revisados aún.</p>;

	return (
		<div className="pt-8 pr-8">
			<div className="bg-white shadow-md rounded-lg overflow-hidden">
				<Table className="table-auto">
					<TableCaption>Historial de perfiles revisados</TableCaption>
					<TableHeader className="bg-table-header">
						<TableRow>
							<TableHead className="whitespace-normal text-center">Nombre</TableHead>
							<TableHead className="whitespace-normal text-center">Código</TableHead>
							<TableHead className="whitespace-normal text-center">Programa</TableHead>
							<TableHead className="whitespace-normal text-center">Correo</TableHead>
							<TableHead className="min-w-[140px] whitespace-nowrap text-center">Fecha envío</TableHead>
							<TableHead className="whitespace-normal text-center">Estado</TableHead>
							<TableHead className="min-w-[140px] whitespace-nowrap text-center">Fecha revisión</TableHead>
							<TableHead className="whitespace-normal text-center">Acciones</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{profiles.map(profile => (
							<TableRow key={profile.id} className="hover:bg-slate-50">
								<TableCell className="p-4 align-middle whitespace-normal text-center font-medium">
									{profile.fullName}
								</TableCell>
								<TableCell className="p-4 align-middle whitespace-normal text-center">{profile.studentCode}</TableCell>
								<TableCell className="p-4 align-middle whitespace-normal text-center">{profile.planName}</TableCell>
								<TableCell className="p-4 align-middle whitespace-normal text-center">{profile.user.email}</TableCell>

								<TableCell className="p-4 align-middle whitespace-nowrap text-center">
									{profile.submittedAt
										? new Date(profile.submittedAt).toLocaleDateString('es-CO', {
												year: 'numeric',
												month: 'short',
												day: 'numeric',
											})
										: 'Sin fecha de envío'}
								</TableCell>

								<TableCell className="p-4 align-middle whitespace-normal text-center">
									<span
										className={`px-2 py-1 rounded text-white text-xs font-medium ${
											profile.status === 'APPROVED' ? 'bg-green-500' : 'bg-red-500'
										}`}
									>
										{profile.status === 'APPROVED' ? 'Aprobado' : 'Rechazado'}
									</span>
								</TableCell>

								<TableCell className="p-4 align-middle whitespace-nowrap text-center">
									{profile.reviewedAt
										? new Date(profile.reviewedAt).toLocaleDateString('es-CO', {
												year: 'numeric',
												month: 'short',
												day: 'numeric',
											})
										: 'Sin fecha de revisión'}
								</TableCell>

								<TableCell className="p-4 align-middle whitespace-nowrap text-center">
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
		</div>
	);
};

export default ReviewProfileHistory;
