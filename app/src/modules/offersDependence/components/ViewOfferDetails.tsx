import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Offer } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { API_BASE_URL, DEPENDENCE_APPLICANTS, DEPENDENCE_OFFERS } from '@/constants/path';
import { toast } from 'react-toastify';
import {
	CalendarDays,
	Clock,
	RefreshCcw,
	GraduationCap,
	Users,
	User2,
	Mail,
	BookOpen,
	FileCheck,
} from 'lucide-react';

type OfferDetail = Offer & {
	college: {
		id: string;
		name: string;
		faculty?: { id: string; name: string } | null;
	} | null;
	_count: {
		Application: number;
	};
	Application: {
		id: string;
		status: string;
		user: {
			id: string;
			name: string;
			lastName: string;
			email: string;
			StudentProfile: {
				studentCode: string;
				planName: string;
				semester: number;
			} | null;
		};
	}[];
};

const STATUS_MAP: Record<string, { label: string; color: string }> = {
	UNDER_REVIEW: { label: 'En revisión', color: 'bg-yellow-400' },
	CALLED_FOR_INTERVIEW: { label: 'Citado a entrevista', color: 'bg-indigo-400' },
	APPROVED: { label: 'Aprobado', color: 'bg-green-500' },
	REJECTED: { label: 'Rechazado', color: 'bg-red-500' },
};

const formatDate = (date: string | Date) =>
	new Date(date).toLocaleDateString('es-CO', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});

export default function ViewOfferDetails() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { createAuthFetchOptions } = useAuth();

	const [offer, setOffer] = useState<OfferDetail | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchOffer = useCallback(async () => {
		try {
			const authOptions = await createAuthFetchOptions();
			const response = await fetch(`${API_BASE_URL}/offers-dependence/${id}/details`, authOptions);
			if (!response.ok) {
				const error = await response.json();
				toast.error(error.error || 'Error al cargar la oferta');
				return;
			}
			const data = await response.json();
			setOffer(data);
		} catch (error) {
			console.error(error);
			toast.error('Error de conexión con el servidor');
		} finally {
			setLoading(false);
		}
	}, [id, createAuthFetchOptions]);

	useEffect(() => {
		fetchOffer();
	}, [fetchOffer]);

	const handleBack = () => navigate(DEPENDENCE_OFFERS);
	const handleViewApplicants = () =>
		navigate(DEPENDENCE_APPLICANTS.replace(':id', offer?.id || ''), {
			state: { from: `${DEPENDENCE_OFFERS}/${offer?.id}/details` },
		});

	if (loading) {
		return (
			<div className="mt-6 text-center">
				<p className="text-slate-500">Cargando información...</p>
			</div>
		);
	}

	if (!offer) {
		return (
			<div className="mt-6 text-center">
				<p className="text-slate-500">No se encontró la oferta solicitada.</p>
			</div>
		);
	}

	return (
		<div className="space-y-6 mt-6 pr-6">
			<button type='button' onClick={handleBack} className="bg-button-create text-white px-2 py-1.5 rounded-md hover:bg-gray-800 transition">
				← Volver a ofertas
			</button>

			<div className="bg-white rounded-2xl shadow-md p-8 border border-slate-200">
				<div className="flex justify-between items-start mb-4">
					<div>
						<h1 className="text-2xl font-bold text-gray-900">{offer.title}</h1>
						<div className="flex items-center text-gray-600 mt-1 text-sm">
							<GraduationCap className="w-4 h-4 mr-2" />
							<span>
								{offer.college?.faculty?.name ?? 'Sin facultad'} - {offer.college?.name ?? 'Sin escuela'}
							</span>
						</div>
					</div>
					{offer.status ? (
						<Badge variant="success" className="text-xs px-3 py-1">Abierta</Badge>
					) : (
						<Badge variant="destructive" className="text-xs px-3 py-1">Cerrada</Badge>
					)}
				</div>

				<div className="space-y-6 mt-4">
					<div>
						<h3 className="text-sm font-semibold text-gray-800 mb-1 flex items-center">
							<BookOpen className="w-4 h-4 mr-2 text-gray-700" /> DESCRIPCIÓN
						</h3>
						<p className="text-gray-700 leading-relaxed whitespace-pre-line">
							{offer.description || 'Sin descripción disponible.'}
						</p>
					</div>

					<div>
						<h3 className="text-sm font-semibold text-gray-800 mb-1 flex items-center">
							<FileCheck className="w-4 h-4 mr-2 text-gray-700" /> REQUISITOS
						</h3>
						<p className="text-gray-700 whitespace-pre-line">
							{offer.requirements || 'Sin requisitos especificados.'}
						</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-gray-100">
						<div className="flex items-start gap-2">
							<CalendarDays className="w-5 h-5 text-red-500 mt-0.5" />
							<div>
								<p className="text-xs text-gray-500">Fecha de cierre</p>
								<p className="font-medium text-gray-800">{formatDate(offer.closeDate)}</p>
							</div>
						</div>

						<div className="flex items-start gap-2">
							<Clock className="w-5 h-5 text-blue-500 mt-0.5" />
							<div>
								<p className="text-xs text-gray-500">Creación</p>
								<p className="font-medium text-gray-800">{formatDate(offer.createdAt)}</p>
							</div>
						</div>

						<div className="flex items-start gap-2">
							<RefreshCcw className="w-5 h-5 text-purple-500 mt-0.5" />
							<div>
								<p className="text-xs text-gray-500">Actualización</p>
								<p className="font-medium text-gray-800">{formatDate(offer.updatedAt)}</p>
							</div>
						</div>
					</div>

					<div className="mt-6 pt-5 border-t border-gray-100">
						<div className="flex items-center justify-between mb-3">
							<div className="flex items-center gap-2">
								<Users className="w-5 h-5 text-gray-700" />
								<h3 className="text-sm font-semibold text-gray-800">APLICANTES</h3>
							</div>
							<Badge variant="secondary" className="text-sm">
								{offer._count.Application} aplicante{offer._count.Application !== 1 && 's'}
							</Badge>
						</div>

						{offer.Application.length > 0 ? (
							<div className="space-y-3">
								{offer.Application.map(app => {
									const statusInfo =
										STATUS_MAP[app.status] || { label: 'Desconocido', color: 'bg-gray-400' };

									return (
										<div
											key={app.id}
											className="border border-slate-200 bg-slate-50 rounded-xl p-4 shadow-sm hover:shadow-md transition"
										>
											<div className="grid grid-cols-1 sm:grid-cols-5 items-center gap-3 text-sm">
												<p className="font-semibold text-gray-800 flex items-center gap-1 truncate">
													<User2 className="w-4 h-4 text-gray-600" /> {app.user.name} {app.user.lastName}
												</p>
												<p className="text-gray-600 truncate">
													🎓 {app.user.StudentProfile?.planName ?? 'No registrado'}
												</p>
												<p className="text-gray-600 truncate">
													📚 Semestre {app.user.StudentProfile?.semester ?? 'N/A'}
												</p>
												<p className="flex items-center gap-1 text-gray-600 truncate">
													<Mail className="w-4 h-4 text-gray-500" /> {app.user.email}
												</p>
												<Badge className={`${statusInfo.color} text-white justify-self-end`}>
													{statusInfo.label}
												</Badge>
											</div>
										</div>
									);
								})}
							</div>
						) : (
							<p className="text-sm text-slate-500 mt-2">No hay aplicantes registrados aún.</p>
						)}

						{offer._count.Application > 0 && (
							<div className="flex justify-end mt-5">
								<Button
									variant="outline"
									size="sm"
									className="border-blue-400 text-blue-600 hover:bg-blue-50"
									onClick={handleViewApplicants}
								>
									Ver todos los aplicantes
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
