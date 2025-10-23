import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { API_BASE_URL, DEPENDENCE_APPLICANTS_DETAILS, DEPENDENCE_OFFERS } from '@/constants/path';

type ApplicationStatus = 'SENT' | 'UNDER_REVIEW' | 'CALLED_FOR_INTERVIEW' | 'APPROVED' | 'REJECTED';

type Applicant = {
	applicationId: string;
	status: ApplicationStatus;
	appliedAt: string;
	interviewDate: string | null;
	attendedInterview?: boolean | null;
	user: {
		id: string;
		name: string;
		lastName: string;
		email: string;
		college?: {
			id: string;
			name: string;
			faculty?: { id: string; name: string } | null;
		} | null;
	};
};

type OfferApplicants = {
	offer: {
		id: string;
		title: string;
	};
	applicants: Applicant[];
};

const formatDate = (date: string | Date) =>
	new Date(date).toLocaleDateString('es-CO', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});

export function ViewApplicants() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { createAuthFetchOptions } = useAuth();
	const [data, setData] = useState<OfferApplicants | null>(null);
	const [loading, setLoading] = useState(true);
	const location = useLocation();
	const [showInterviewModal, setShowInterviewModal] = useState(false);
	const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
	const [showAttendanceModal, setShowAttendanceModal] = useState(false);
	const [selectedAttendanceApplicant, setSelectedAttendanceApplicant] = useState<Applicant | null>(null);
	const [interviewDate, setInterviewDate] = useState<string>('');

	const fetchApplicants = useCallback(async () => {
		try {
			const authOptions = await createAuthFetchOptions();
			const response = await fetch(`${API_BASE_URL}/offers-dependence/${id}/applicants`, authOptions);

			if (!response.ok) {
				const err = await response.json();
				toast.error(err.error || 'Error al obtener los aplicantes');
				return;
			}

			const json = await response.json();
			setData(json);
		} catch (error) {
			console.error(error);
			toast.error('Error de conexión con el servidor');
		} finally {
			setLoading(false);
		}
	}, [createAuthFetchOptions, id]);

	useEffect(() => {
		fetchApplicants();
	}, [fetchApplicants]);

	const handleBack = () => {
		if (location.state?.from) {
			navigate(location.state.from);
		} else {
			navigate(DEPENDENCE_OFFERS);
		}
	};

	const handleViewProfile = async (applicant: Applicant) => {
		try {
			if (applicant.status === 'SENT') {
				await handleStatusChange(applicant.applicationId, 'UNDER_REVIEW');
			}
			navigate(DEPENDENCE_APPLICANTS_DETAILS.replace(':id', applicant.user.id), {
				state: {
					from: location.state?.from || `${DEPENDENCE_OFFERS}/${data?.offer.id}/applicants`,
				},
			});
		} catch (error) {
			console.error(error);
			toast.error('No se pudo abrir el perfil del aplicante');
		}
	};

	const handleStatusChange = async (
		applicationId: string,
		newStatus: ApplicationStatus,
		interviewDate?: string,
		attendedInterview?: boolean,
	) => {
		try {
			const authOptions = await createAuthFetchOptions();
			const response = await fetch(`${API_BASE_URL}/offers-dependence/${applicationId}/status`, {
				...authOptions,
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					...(authOptions.headers || {}),
				},
				body: JSON.stringify({
					status: newStatus,
					...(interviewDate ? { interviewDate: new Date(interviewDate) } : {}),
					...(attendedInterview !== undefined ? { attendedInterview } : {}),
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				toast.error(error.error || 'Error al actualizar la aplicación');
				return;
			}

			const updatedApp = await response.json();
			if (attendedInterview !== undefined && newStatus === updatedApp.status) {
				toast.success(
					attendedInterview
						? 'Asistencia registrada: El estudiante asistió ✅'
						: 'Asistencia registrada: El estudiante no asistió ❌',
				);
			} else {
				toast.success(
					`Estado actualizado a ${
						newStatus === 'UNDER_REVIEW'
							? 'En revisión'
							: newStatus === 'CALLED_FOR_INTERVIEW'
								? 'Citado a entrevista'
								: newStatus === 'APPROVED'
									? 'Aprobado'
									: 'Rechazado'
					}`,
				);
			}

			setData(prev =>
				prev
					? {
							...prev,
							applicants: prev.applicants.map(app =>
								app.applicationId === updatedApp.id
									? {
											...app,
											status: updatedApp.status,
											interviewDate: updatedApp.interviewDate,
											attendedInterview: updatedApp.attendedInterview ?? undefined,
										}
									: app,
							),
						}
					: prev,
			);
		} catch (error) {
			console.error(error);
			toast.error('Error de conexión al actualizar estado');
		}
	};

	const getStatusLabel = (status: ApplicationStatus, attendedInterview?: boolean | null) => {
		if (status === 'CALLED_FOR_INTERVIEW') {
			if (attendedInterview === true) return 'Entrevista realizada';
			if (attendedInterview === false) return 'No asistió a la entrevista';
			return 'Citado a entrevista';
		}

		switch (status) {
			case 'UNDER_REVIEW':
				return 'En revisión';
			case 'APPROVED':
				return 'Aprobado';
			case 'REJECTED':
				return 'Rechazado';
			default:
				return 'Desconocido';
		}
	};

	const getStatusColor = (status: ApplicationStatus, attendedInterview?: boolean | null) => {
		if (status === 'CALLED_FOR_INTERVIEW') {
			if (attendedInterview === true) return 'bg-blue-500';
			if (attendedInterview === false) return 'bg-orange-400';
			return 'bg-indigo-400';
		}
		switch (status) {
			case 'UNDER_REVIEW':
				return 'bg-yellow-400';
			case 'APPROVED':
				return 'bg-green-500';
			case 'REJECTED':
				return 'bg-red-500';
			default:
				return 'bg-gray-400';
		}
	};

	if (loading) {
		return (
			<div className="mt-6 space-y-4 text-center">
				<Button variant="outline" onClick={handleBack} className="border-slate-300 hover:bg-slate-100">
					← Volver a ofertas
				</Button>
				<p className="text-slate-500 mt-4">Cargando aplicantes...</p>
			</div>
		);
	}

	if (!data || !data.applicants || data.applicants.length === 0) {
		return (
			<div className="mt-6 space-y-4">
				<Button variant="outline" onClick={handleBack} className="border-slate-300 hover:bg-slate-100">
					← Volver a ofertas
				</Button>

				<Card className="shadow-sm border border-slate-200">
					<CardHeader>
						<CardTitle className="text-lg font-semibold text-slate-700">
							Aplicantes para: {data?.offer?.title ?? 'Oferta sin título'}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-slate-500 text-sm">No hay aplicantes registrados.</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-4 mt-6 pr-6">
			<Button variant="outline" onClick={handleBack} className="border-slate-300 hover:bg-slate-100">
				← Volver
			</Button>
			<Card className="border border-slate-200 shadow-sm">
				<CardHeader>
					<div className="flex justify-between items-center">
						<CardTitle className="text-xl font-semibold">Aplicantes para: {data.offer.title}</CardTitle>
						<Badge variant="secondary">
							{data.applicants.length} aplicante
							{data.applicants.length > 1 && 's'}
						</Badge>
					</div>
				</CardHeader>

				<CardContent className="space-y-3">
					{data.applicants.map(applicant => (
						<div key={applicant.applicationId} className="border border-slate-300 bg-white shadow-md rounded-xl p-4">
							<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
								<div className="flex flex-col text-md">
									<p className="font-semibold text-slate-800 flex items-center gap-1">
										👤 {applicant.user.name} {applicant.user.lastName}
									</p>
									<p className="text-slate-600 text-sm flex items-center gap-1 mt-1">✉️ {applicant.user.email}</p>
									<p className="text-slate-600 text-sm flex items-center gap-1 mt-1">
										🏫 {applicant.user.college?.faculty?.name ?? 'Facultad no especificada'} -{' '}
										{applicant.user.college?.name ?? 'Escuela no especificada'}
									</p>
									<p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
										📅 Aplicó el {formatDate(applicant.appliedAt)}
									</p>

									{applicant.interviewDate && (
										<p className="text-indigo-600 text-sm flex items-center gap-1 mt-1 font-medium">
											📅 Entrevista programada para:{' '}
											{new Date(applicant.interviewDate).toLocaleString('es-CO', {
												year: 'numeric',
												month: 'long',
												day: 'numeric',
												hour: '2-digit',
												minute: '2-digit',
												hour12: true,
											})}
										</p>
									)}
								</div>

								<div className="flex flex-col items-end mt-3 sm:mt-0">
									<Badge className={`${getStatusColor(applicant.status, applicant.attendedInterview)} text-white mb-2`}>
										{getStatusLabel(applicant.status, applicant.attendedInterview)}
									</Badge>

									<Button
										variant="outline"
										size="sm"
										onClick={() => handleViewProfile(applicant)}
										className="border-slate-400 text-slate-600 hover:bg-slate-100 mb-2"
									>
										Ver perfil
									</Button>

									<div className="flex flex-wrap justify-end gap-2">
										<Button
											variant="outline"
											size="sm"
											disabled={
												applicant.status === 'SENT' ||
												applicant.status === 'CALLED_FOR_INTERVIEW' ||
												applicant.status === 'APPROVED' ||
												applicant.status === 'REJECTED'
											}
											onClick={() => {
												setSelectedApplicant(applicant);
												setShowInterviewModal(true);
											}}
											className="border-indigo-400 text-indigo-600 hover:bg-indigo-50"
										>
											Entrevista
										</Button>

										{applicant.status === 'CALLED_FOR_INTERVIEW' && applicant.interviewDate && (
											<Button
												variant="outline"
												size="sm"
												disabled={applicant.attendedInterview !== null && applicant.attendedInterview !== undefined}
												onClick={() => {
													const interviewDate = new Date(applicant.interviewDate!);
													const now = new Date();

													if (interviewDate > now) {
														toast.warning('No puedes marcar asistencia antes de la fecha de entrevista.');
														return;
													}

													setSelectedAttendanceApplicant(applicant);
													setShowAttendanceModal(true);
												}}
												className={`border-blue-500 text-blue-600 hover:bg-blue-50 ${
													applicant.attendedInterview !== null && applicant.attendedInterview !== undefined
														? 'opacity-50 cursor-not-allowed'
														: ''
												}`}
											>
												Registrar asistencia
											</Button>
										)}

										<Button
											variant="outline"
											size="sm"
											disabled={
												applicant.status !== 'CALLED_FOR_INTERVIEW' ||
												!applicant.interviewDate ||
												applicant.attendedInterview !== true
											}
											onClick={async () => {
												const interviewDate = new Date(applicant.interviewDate!);
												const now = new Date();

												if (interviewDate > now) {
													toast.warning('No puedes aprobar antes de que se realice la entrevista.');
													return;
												}

												await handleStatusChange(applicant.applicationId, 'APPROVED');
											}}
											className="border-green-500 text-green-600 hover:bg-green-50"
										>
											Aprobar
										</Button>

										<Button
											variant="outline"
											size="sm"
											disabled={
												applicant.status !== 'CALLED_FOR_INTERVIEW' ||
												!applicant.interviewDate ||
												applicant.attendedInterview !== false
											}
											onClick={async () => {
												const interviewDate = new Date(applicant.interviewDate!);
												const now = new Date();

												if (interviewDate > now) {
													toast.warning('No puedes rechazar antes de que se realice la entrevista.');
													return;
												}

												await handleStatusChange(applicant.applicationId, 'REJECTED');
											}}
											className="border-red-500 text-red-600 hover:bg-red-50"
										>
											Rechazar
										</Button>
									</div>
								</div>
							</div>
						</div>
					))}
				</CardContent>
			</Card>
			{showInterviewModal && (
				<div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md">
						<h2 className="text-lg font-semibold mb-3 text-slate-800">Programar entrevista</h2>
						<p className="text-sm text-slate-600 mb-4">
							Selecciona la fecha y hora de la entrevista para{' '}
							<span className="font-medium">
								{selectedApplicant?.user.name} {selectedApplicant?.user.lastName}
							</span>
						</p>

						<input
							type="datetime-local"
							className="w-full border border-slate-300 rounded-md p-2 mb-4"
							value={interviewDate}
							onChange={e => setInterviewDate(e.target.value)}
						/>

						<div className="flex justify-end gap-3">
							<Button
								variant="outline"
								onClick={() => {
									setShowInterviewModal(false);
									setInterviewDate('');
									setSelectedApplicant(null);
								}}
								className="border-slate-300 text-slate-600"
							>
								Cancelar
							</Button>
							<Button
								onClick={async () => {
									if (!interviewDate) {
										toast.warning('Debes seleccionar una fecha de entrevista');
										return;
									}
									if (selectedApplicant) {
										await handleStatusChange(selectedApplicant.applicationId, 'CALLED_FOR_INTERVIEW', interviewDate);
									}
									setShowInterviewModal(false);
									setInterviewDate('');
									setSelectedApplicant(null);
								}}
								className="bg-indigo-600 text-white hover:bg-indigo-700"
							>
								Confirmar
							</Button>
						</div>
					</div>
				</div>
			)}
			{showAttendanceModal && selectedAttendanceApplicant && (
				<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md text-center">
						<h2 className="text-lg font-semibold mb-3 text-slate-800">Registrar asistencia a entrevista</h2>
						<p className="text-sm text-slate-600 mb-5">
							¿El estudiante{' '}
							<span className="font-medium">
								{selectedAttendanceApplicant.user.name} {selectedAttendanceApplicant.user.lastName}
							</span>{' '}
							asistió a la entrevista?
						</p>

						<div className="flex justify-center gap-3">
							<Button
								onClick={async () => {
									await handleStatusChange(
										selectedAttendanceApplicant.applicationId,
										selectedAttendanceApplicant.status,
										selectedAttendanceApplicant.interviewDate ?? undefined,
										true, // asistió
									);
									setShowAttendanceModal(false);
									setSelectedAttendanceApplicant(null);
								}}
								className="bg-green-600 text-white hover:bg-green-700"
							>
								✅ Sí, asistió
							</Button>

							<Button
								onClick={async () => {
									await handleStatusChange(
										selectedAttendanceApplicant.applicationId,
										selectedAttendanceApplicant.status,
										selectedAttendanceApplicant.interviewDate ?? undefined,
										false, // no asistió
									);
									setShowAttendanceModal(false);
									setSelectedAttendanceApplicant(null);
								}}
								className="bg-red-600 text-white hover:bg-red-700"
							>
								❌ No asistió
							</Button>

							<Button
								variant="outline"
								onClick={() => {
									setShowAttendanceModal(false);
									setSelectedAttendanceApplicant(null);
								}}
								className="border-slate-300 text-slate-600"
							>
								Cancelar
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
