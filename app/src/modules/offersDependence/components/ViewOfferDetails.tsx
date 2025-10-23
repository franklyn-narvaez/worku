'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Offer } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { API_BASE_URL, DEPENDENCE_APPLICANTS, DEPENDENCE_OFFERS } from '@/constants/path';
import { toast } from 'react-toastify';

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
		<div className="space-y-4 mt-6">
			<Button variant="outline" onClick={handleBack} className="border-slate-300 hover:bg-slate-100">
				← Volver a ofertas
			</Button>

			<Card className="border border-slate-200 shadow-sm">
				<CardHeader>
					<div className="flex justify-between items-center">
						<CardTitle className="text-xl font-semibold">{offer.title}</CardTitle>
						<Badge variant={offer.status ? 'success' : 'destructive'} className="text-sm px-3">
							{offer.status ? 'Activa' : 'Inactiva'}
						</Badge>
					</div>
					<p className="text-sm text-slate-500 mt-1">
						{offer.college?.faculty?.name ?? 'Sin facultad asignada'} - {offer.college?.name ?? 'Sin escuela asignada'}
					</p>
				</CardHeader>

				<CardContent className="space-y-3">
					<div>
						<p className="text-sm text-slate-600 font-medium">Descripción:</p>
						<p className="text-slate-700 whitespace-pre-line">{offer.description}</p>
					</div>

					<div>
						<p className="text-sm text-slate-600 font-medium">Requisitos:</p>
						<p className="text-slate-700 whitespace-pre-line">{offer.requirements}</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-slate-600">
						<p>📅 Creada: {formatDate(offer.createdAt)}</p>
						<p>🕓 Actualizada: {formatDate(offer.updatedAt)}</p>
						<p>⏳ Cierra: {formatDate(offer.closeDate)}</p>
					</div>

					{/* Aplicantes */}
					<div className="mt-4 pt-3 border-t">
						<Badge variant="secondary" className="mb-2">
							{offer._count.Application} aplicante
							{offer._count.Application !== 1 && 's'}
						</Badge>

						{offer.Application && offer.Application.length > 0 ? (
							<div className="space-y-3">
								{offer.Application.map(app => {
									const statusInfo = STATUS_MAP[app.status] || { label: 'Desconocido', color: 'bg-gray-400' };

									return (
										<div key={app.id} className="border border-slate-200 bg-white shadow-md rounded-xl p-4">
											<div className="grid grid-cols-5 items-center gap-2 text-sm w-full">
												<p className="font-semibold text-slate-800 flex items-center gap-1 truncate">
													👤 {app.user.name} {app.user.lastName}
												</p>
												<p className="flex items-center gap-1 text-slate-600 text-sm truncate">
													🎓 Programa {app.user.StudentProfile?.planName ?? 'No registrado'}
												</p>
												<p className="flex items-center gap-1 text-slate-600 text-sm truncate">
													📚 Semestre {app.user.StudentProfile?.semester ?? 'No registrado'}
												</p>
												<p className="flex items-center gap-1 text-slate-500 text-sm truncate">✉️ {app.user.email}</p>

												<Badge className={`${statusInfo.color} text-white justify-self-end`}>{statusInfo.label}</Badge>
											</div>
										</div>
									);
								})}
							</div>
						) : (
							<p className="text-sm text-slate-500 mt-2">No hay aplicantes registrados aún.</p>
						)}
					</div>

					{/* Botón ver todos */}
					<div className="flex justify-end mt-4">
						<Button
							variant="outline"
							size="sm"
							className="border-blue-400 text-blue-600 hover:bg-blue-50"
							onClick={handleViewApplicants}
						>
							Ver todos los aplicantes
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
