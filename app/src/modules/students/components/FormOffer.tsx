import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { API_BASE_URL, STUDENT_PROFILES, VIEW_PROFILE } from '@/constants/path';
import { useAuth } from '@/hooks/useAuth';
import type { Offer } from '@prisma/client';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import StudentOfferDetails from './OfferModal';
import { useState } from 'react';
import { Eye } from 'lucide-react';

type ExtendedOffer = Offer & {
	college: {
		id: string;
		name: string;
	} | null;
	faculty: {
		id: string;
		name: string;
	} | null;
	userApplicationStatus?: 'SENT' | 'UNDER_REVIEW' | 'CALLED_FOR_INTERVIEW' | 'PENDING' | 'APPROVED' | 'REJECTED' | null;
	interviewDate?: Date | null;
	attendedInterview?: boolean | null;
};

type ApplyOfferType = {
	offerId: string;
};

const formatDate = (date: string | Date) =>
	new Date(date).toLocaleDateString('es-CO', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
const formatTime = (date: string | Date) =>
	new Date(date).toLocaleString('es-CO', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: true,
	});
const getStatusLabel = (status: ExtendedOffer['userApplicationStatus'], attendedInterview?: boolean | null) => {
	if (status === 'CALLED_FOR_INTERVIEW') {
		if (attendedInterview === true) return 'Entrevista realizada';
		if (attendedInterview === false) return 'No asistió a la entrevista';
		return 'Citada a entrevista';
	}

	switch (status) {
		case 'SENT':
			return 'Aplicación enviada';
		case 'UNDER_REVIEW':
			return 'Aplicación en revisión';
		case 'APPROVED':
			return 'Aplicación aprobada';
		case 'REJECTED':
			return 'Aplicación rechazada';
		case 'PENDING':
			return 'Aplicación pendiente';
		default:
			return 'No aplicado';
	}
};

const getStatusColor = (status: ExtendedOffer['userApplicationStatus'], attendedInterview?: boolean | null) => {
	if (status === 'CALLED_FOR_INTERVIEW') {
		if (attendedInterview === true) return 'bg-blue-500';
		if (attendedInterview === false) return 'bg-orange-400';
		return 'bg-indigo-500';
	}

	switch (status) {
		case 'SENT':
			return 'bg-blue-400';
		case 'UNDER_REVIEW':
			return 'bg-purple-500';
		case 'APPROVED':
			return 'bg-green-500';
		case 'REJECTED':
			return 'bg-red-500';
		case 'PENDING':
			return 'bg-yellow-400';
		default:
			return 'bg-gray-300';
	}
};

export function FormOffer({ offer }: { offer: ExtendedOffer }) {
	const { createAuthFetchOptions } = useAuth();
	const navigate = useNavigate();
	const { register, handleSubmit, reset } = useForm<ApplyOfferType>();

	const [currentOffer, setCurrentOffer] = useState(offer);
	const [openDetails, setOpenDetails] = useState(false);

	const alreadyApplied = !!currentOffer.userApplicationStatus;

	const onSubmit: SubmitHandler<ApplyOfferType> = async data => {
		try {
			const authOptions = await createAuthFetchOptions();

			const studentProfileRes = await fetch(VIEW_PROFILE, authOptions);

			if (!studentProfileRes.ok) {
				toast.warn('Debes crear y completar tu perfil antes de aplicar a una oferta.');
				navigate(STUDENT_PROFILES);
				return;
			}

			const studentProfile = await studentProfileRes.json();

			if (studentProfile.status !== 'APPROVED') {
				let message = 'Tu perfil debe estar aprobado para aplicar a ofertas.';

				if (studentProfile.status === 'SUBMITTED') {
					message = 'Tu perfil está en revisión. Espera la aprobación para aplicar.';
				} else if (studentProfile.status === 'REJECTED') {
					message = 'Tu perfil fue rechazado. Debes corregirlo antes de aplicar.';
				}

				toast.warn(message);
				return;
			}

			const response = await fetch(`${API_BASE_URL}/student-offers/${data.offerId}/apply`, {
				...authOptions,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					...(authOptions.headers || {}),
				},
				body: JSON.stringify(data),
			});

			if (response.ok) {
				toast.success('¡Aplicaste correctamente a esta oferta!');
				setCurrentOffer(prev => ({
					...prev,
					userApplicationStatus: 'SENT',
				}));
				reset();
			} else {
				const errorData = await response.json();
				toast.warn(errorData.error || 'Error al aplicar a la oferta');
			}
		} catch (error) {
			console.error('Error en la aplicación:', error);
			toast.error('Error de conexión al aplicar a la oferta');
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-slate-200">
					<CardHeader className="flex flex-col gap-2">
						<div className="flex justify-between items-center">
							<div className="flex flex-col">
								<div className="flex items-center gap-2 flex-wrap">
									<CardTitle className="text-lg font-semibold break-words">
										{currentOffer.title}
									</CardTitle>

									<Badge
										className={`${getStatusColor(
											currentOffer.userApplicationStatus,
											currentOffer.attendedInterview
										)} text-white whitespace-nowrap`}
									>
										{getStatusLabel(
											currentOffer.userApplicationStatus,
											currentOffer.attendedInterview
										)}
									</Badge>
								</div>

								<p className="text-sm text-slate-500 mt-1">
									Publicada: {formatDate(currentOffer.createdAt)}
								</p>
							</div>

							<div className="flex items-center gap-2 shrink-0">
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={() => setOpenDetails(true)}
								>
									<Eye className="w-5 h-5" />
								</Button>

								<Badge
									variant={currentOffer.status ? 'default' : 'secondary'}
									className={`${currentOffer.status ? 'bg-green-500' : 'bg-red-400'
										} text-white whitespace-nowrap`}
								>
									{currentOffer.status ? 'Activa' : 'Inactiva'}
								</Badge>
							</div>
						</div>

						{currentOffer.interviewDate && (
							<p className="text-sm mt-1 leading-snug">
								{currentOffer.userApplicationStatus === 'CALLED_FOR_INTERVIEW' &&
									currentOffer.attendedInterview === null && (
										<span className="text-indigo-600 font-medium">
											📅 Programada para: {formatTime(currentOffer.interviewDate)}
										</span>
									)}

								{currentOffer.userApplicationStatus === 'CALLED_FOR_INTERVIEW' &&
									currentOffer.attendedInterview === true && (
										<span className="text-blue-600 font-medium">
											✅ Entrevista realizada el {formatTime(currentOffer.interviewDate)}
										</span>
									)}

								{currentOffer.userApplicationStatus === 'CALLED_FOR_INTERVIEW' &&
									currentOffer.attendedInterview === false && (
										<span className="text-orange-600 font-medium">
											❌ No asististe a la entrevista programada el {formatTime(currentOffer.interviewDate)}
										</span>
									)}

								{currentOffer.userApplicationStatus === 'APPROVED' && (
									<span className="text-green-600 font-medium">
										✅ Aplicación aprobada tras entrevista el {formatTime(currentOffer.interviewDate)}
									</span>
								)}

								{currentOffer.userApplicationStatus === 'REJECTED' && (
									<span className="text-red-600 font-medium">
										❌ Aplicación rechazada tras entrevista el {formatTime(currentOffer.interviewDate)}
									</span>
								)}
							</p>
						)}
					</CardHeader>

					<CardContent className="space-y-4">
						<p className="text-slate-700 line-clamp-3">{currentOffer.description || 'Sin descripción'}</p>

						{currentOffer.requirements && (
							<div>
								<h4 className="text-sm font-semibold text-slate-600 mb-1">Requisitos:</h4>
								<p className="text-sm text-slate-700 line-clamp-2">{currentOffer.requirements}</p>
							</div>
						)}

						<div className="flex flex-col gap-1 text-sm text-slate-600">
							<p>
								<span className="font-medium">Escuela: </span>
								{currentOffer.college?.name ?? 'No especificada'}
							</p>
							<p>
								<span className="font-medium">Facultad: </span>
								{currentOffer.faculty?.name ?? 'No especificada'}
							</p>
						</div>

						<p className="text-xs text-slate-500">Fecha de cierre: {formatDate(currentOffer.closeDate)}</p>

						<input type="hidden" value={currentOffer.id} {...register('offerId')} />

						<div className="pt-2">
							<Button
								type="submit"
								variant="outline"
								className="w-full"
								disabled={!currentOffer.status || alreadyApplied}
							>
								{alreadyApplied
									? 'Ya has aplicado'
									: currentOffer.status
										? 'Aplicar a la oferta'
										: 'Oferta cerrada'}
							</Button>
						</div>
					</CardContent>
				</Card>
			</form>
			<StudentOfferDetails open={openDetails} onClose={() => setOpenDetails(false)} offer={currentOffer} />
		</div>
	);
}
