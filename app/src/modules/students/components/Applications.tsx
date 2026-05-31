import type { Application } from '@prisma/client';
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { API_BASE_URL } from '@/constants/path';
import { useAuth } from '@/hooks/useAuth';

type ExtendedApplication = Application & {
	offer: {
		id: string;
		title: string;
		description: string;
		closeDate: string;
	};
};

const MyApplications = () => {
	const { createAuthFetchOptions } = useAuth();
	const [applications, setApplications] = useState<ExtendedApplication[]>([]);

	useEffect(() => {
		const fetchApplications = async () => {
			try {
				const fetchOptions = await createAuthFetchOptions();
				const res = await fetch(`${API_BASE_URL}/student-offers/applications`, fetchOptions);
				const data = await res.json();
				setApplications(data);
			} catch (error) {
				console.error('Error fetching applications:', error);
			}
		};

		fetchApplications();
	}, [createAuthFetchOptions]);

	const formatStatus = (status: ExtendedApplication['status']) => {
		switch (status) {
			case 'SENT':
				return 'Enviada';
			case 'UNDER_REVIEW':
				return 'En revisión';
			case 'CALLED_FOR_INTERVIEW':
				return 'Citad@ a entrevista';
			case 'APPROVED':
				return 'Aprobada';
			case 'REJECTED':
				return 'Rechazada';
			default:
				return 'Desconocido';
		}
	};

	const getStatusColor = (status: ExtendedApplication['status']) => {
		switch (status) {
			case 'SENT':
				return 'bg-blue-400';
			case 'UNDER_REVIEW':
				return 'bg-purple-500';
			case 'CALLED_FOR_INTERVIEW':
				return 'bg-indigo-500';
			case 'APPROVED':
				return 'bg-green-500';
			case 'REJECTED':
				return 'bg-red-500';
			default:
				return 'bg-gray-400';
		}
	};

	const formatInterviewDate = (date: string | Date | null | undefined) => {
		if (!date) return 'No programada';
		const formatted = new Date(date).toLocaleString('es-CO', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			hour12: true,
		});
		return formatted.charAt(0).toUpperCase() + formatted.slice(1);
	};

	const formatAttendance = (attendedInterview: boolean | null | undefined) => {
		if (attendedInterview === true) return <span className="text-green-600 font-medium">Asistió</span>;
		if (attendedInterview === false) return <span className="text-red-600 font-medium">No asistió</span>;
		return <span className="text-yellow-600 font-medium">No definida</span>;
	};

	return (
		<div className="pt-8 pr-8">
			<div className="bg-white shadow-md rounded-lg overflow-hidden">
				<Table className="table-auto">
					<TableCaption>Lista de aplicaciones realizadas</TableCaption>
					<TableHeader className="bg-table-header">
						<TableRow>
							<TableHead className="whitespace-normal text-center">Título</TableHead>
							<TableHead className="whitespace-normal text-center">Descripción</TableHead>
							<TableHead className="whitespace-normal text-center">Fecha de aplicación</TableHead>
							<TableHead className="whitespace-normal text-center">Fecha de cierre</TableHead>
							<TableHead className="whitespace-normal text-center">Entrevista</TableHead>
							<TableHead className="whitespace-normal text-center">Asistencia</TableHead>
							<TableHead className="whitespace-normal text-center">Estado</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{applications.map(application => (
							<TableRow key={application.id} className="bg-white border-b hover:bg-gray-100">
								<TableCell className="p-4 align-middle whitespace-normal text-center break-words max-w-[220px]">
									{application.offer.title}
								</TableCell>
								<TableCell className="p-4 align-middle whitespace-normal text-center break-words max-w-[220px]">
									{application.offer.description || 'Sin descripción'}
								</TableCell>
								<TableCell className="p-4 align-middle whitespace-normal text-center">
									{new Date(application.appliedAt).toLocaleDateString('es-CO')}
								</TableCell>
								<TableCell className="p-4 align-middle whitespace-normal text-center">
									{new Date(application.offer.closeDate).toLocaleDateString('es-CO')}
								</TableCell>
								<TableCell className="p-4 align-middle whitespace-normal text-center">
									{application.interviewDate ? (
										<span>{formatInterviewDate(application.interviewDate)}</span>
									) : (
										'No programada'
									)}
								</TableCell>
								<TableCell className="p-4 align-middle whitespace-normal text-center">
									{formatAttendance(application.attendedInterview)}
								</TableCell>
								<TableCell className="p-4 align-middle whitespace-normal text-center">
									<span
										className={`px-2 py-1 rounded text-white text-xs font-medium ${getStatusColor(application.status)}`}
									>
										{formatStatus(application.status)}
									</span>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};

export default MyApplications;
