'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { DIRECTOR_REVIEW_PROFILE_HISTORY, REVIEW_PROFILE } from '@/constants/path';
import { toast } from 'react-toastify';

type Education = {
	id: string;
	level?: string;
	degreeTitle?: string;
	endYear?: number | null;
	institution?: string;
	city?: string;
	semesters?: number | null;
};

type Training = {
	id: string;
	institution?: string;
	courseName?: string;
	duration?: string;
	endDate?: string | null;
};

type Language = {
	id: string;
	language?: string;
	speakLevel?: string;
	writeLevel?: string;
	readLevel?: string;
};

type System = {
	id: string;
	programName?: string;
};

type WorkExperience = {
	id: string;
	companyName?: string;
	role?: string;
	functions?: string;
	bossName?: string;
	startDate?: string | null;
	endDate?: string | null;
};

type Availability = {
	id: string;
	dayOfWeek?: string;
	startTime1?: string;
	endTime1?: string;
	startTime2?: string;
	endTime2?: string;
	startTime3?: string;
	endTime3?: string;
};

type StudentProfile = {
	id: string;
	idNumber?: string;
	fullName?: string;
	age?: number;
	studentCode?: string;
	email?: string;
	emergencyContact: string;
	emergencyPhone: string;
	planCode?: string;
	planName?: string;
	semester?: number;
	campus?: string;
	academicPeriod?: string;
	jornada?: string;
	address?: string;
	birthDate?: string | null;
	phone?: string;
	mobile?: string;
	gender?: string;
	Photo?: string | null;
	Grades?: string | null;
	status?: string;
	rejectComment?: string;
	educations?: Education[];
	trainings?: Training[];
	languages?: Language[];
	systems?: System[];
	workExperiences?: WorkExperience[];
	availabilities?: Availability[];
};

function formatDate(date?: string | null) {
	if (!date) return 'No registrado';
	try {
		return new Date(date).toLocaleDateString('es-CO', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	} catch {
		return date;
	}
}

function formatTime(time?: string | null) {
	if (!time) return 'No registrado';
	try {
		const [hour, minute] = time.split(':').map(Number);
		const date = new Date();
		date.setHours(hour, minute);

		return date.toLocaleTimeString('es-CO', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true,
		});
	} catch {
		return time;
	}
}

const educationLevel: Record<string, string> = {
	HIGH_SCHOOL: 'Bachillerato',
	UNIVERSITY: 'Universidad',
	OTHER: 'Otro nivel de formación',
};

const languageLevels: Record<string, string> = {
	EXCELLENT: 'Excelente',
	GOOD: 'Bueno',
	FAIR: 'Regular',
};

type EmptyHintProps = {
	value?: any;
};

export function EmptyHint({ value }: EmptyHintProps) {
	const isEmpty = value === null || value === undefined || (typeof value === 'string' && value.trim() === '');

	return <>{isEmpty ? <span className="text-gray-400 italic">Sin información</span> : <>{value}</>}</>;
}

export default function StudentReviewProfileHistory() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { createAuthFetchOptions } = useAuth();
	const { state } = useLocation();

	const [profile, setProfile] = useState<StudentProfile | null>(null);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState<
		'overview' | 'education' | 'trainings' | 'languages' | 'systems' | 'experience' | 'availability'
	>('overview');

	const fetchProfile = useCallback(async () => {
		setLoading(true);
		try {
			const authOptions = await createAuthFetchOptions();
			const res = await fetch(`${REVIEW_PROFILE}/${id}/profile/history`, authOptions);

			if (!res.ok) {
				const err = await res.json().catch(() => ({ message: 'Error desconocido' }));
				toast.error(err.message || 'Error al cargar el perfil del estudiante');
				return;
			}

			const data = await res.json();
			setProfile({
				...data,
				educations: data.educations ?? [],
				trainings: data.trainings ?? [],
				languages: data.languages ?? [],
				systems: data.systems ?? [],
				workExperiences: data.workExperiences ?? [],
				availabilities: data.availabilities ?? [],
			});
		} catch {
			toast.error('Error de conexión con el servidor');
		} finally {
			setLoading(false);
		}
	}, [createAuthFetchOptions, id]);

	useEffect(() => {
		fetchProfile();
	}, [fetchProfile]);

	const handleBack = () => {
		navigate(state?.from || DIRECTOR_REVIEW_PROFILE_HISTORY);
	};

	const sectionCounts = useMemo(() => {
		return {
			educations: profile?.educations?.length ?? 0,
			trainings: profile?.trainings?.length ?? 0,
			languages: profile?.languages?.length ?? 0,
			systems: profile?.systems?.length ?? 0,
			experience: profile?.workExperiences?.length ?? 0,
			availability: profile?.availabilities?.length ?? 0,
		};
	}, [profile]);

	if (loading) {
		return (
			<div className="mt-8 text-center">
				<p className="text-slate-500">Cargando perfil...</p>
			</div>
		);
	}

	if (!profile) {
		return (
			<div className="mt-8 text-center">
				<p className="text-slate-500">No se encontró el perfil del estudiante.</p>
				<div className="mt-4">
					<Button variant="outline" onClick={handleBack}>
						← Volver
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6 mt-6 pr-6">
			{/* Header: foto + título + acciones */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div className="flex items-center gap-4">
					<div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
						{profile.Photo ? (
							<img src={profile.Photo} alt={profile.fullName} className="w-full h-full object-cover" />
						) : (
							<div className="w-full h-full flex items-center justify-center text-slate-400">Sin foto</div>
						)}
					</div>

					<div>
						<h1 className="text-2xl font-semibold text-slate-800">{profile.fullName ?? 'Nombre no registrado'}</h1>
						<div className="flex items-center gap-2 mt-1">
							{profile.status && (
								<Badge
									className={`
                        text-white text-sm
                        ${profile.status === 'APPROVED' ? 'bg-green-600' : ''}
                        ${profile.status === 'REJECTED' ? 'bg-red-600' : ''}
                        ${profile.status === 'SUBMITTED' ? 'bg-yellow-500' : ''}
                    `}
								>
									{profile.status === 'APPROVED'
										? 'Aprobado'
										: profile.status === 'REJECTED'
											? 'Rechazado'
											: profile.status === 'SUBMITTED'
												? 'Pendiente de revisión'
												: 'Desconocido'}
								</Badge>
							)}
							<Badge variant="secondary" className="text-md">
								{profile.planName ?? 'Programa no registrado'} -- {profile.planCode ?? 'Código no registrado'}
							</Badge>
							<Badge variant="secondary" className="text-md">
								Semestre: {profile.semester ?? 'Semestre no registrado'}
							</Badge>
						</div>
						{profile.status === 'REJECTED' && profile.rejectComment && (
							<p className="mt-2 text-sm text-red-600 italic">Motivo del rechazo: {profile.rejectComment}</p>
						)}
						<p className="text-sm text-slate-500 mt-1">
							{profile.studentCode ? `Código: ${profile.studentCode}` : null}
						</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					{profile.Grades && (
						<a href={profile.Grades} target="_blank" rel="noreferrer" className="no-underline">
							<Button variant="outline" size="sm">
								Ver certificado
							</Button>
						</a>
					)}
					<Button variant="outline" size="sm" onClick={handleBack}>
						← Volver
					</Button>
				</div>
			</div>

			{/* Quick stats */}
			<div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
				<div className="p-3 bg-white border border-slate-200 rounded-lg text-center">
					<div className="text-xs text-slate-400">Formación</div>
					<div className="text-lg font-semibold">{sectionCounts.educations}</div>
				</div>
				<div className="p-3 bg-white border border-slate-200 rounded-lg text-center">
					<div className="text-xs text-slate-400">Capacitaciones</div>
					<div className="text-lg font-semibold">{sectionCounts.trainings}</div>
				</div>
				<div className="p-3 bg-white border border-slate-200 rounded-lg text-center">
					<div className="text-xs text-slate-400">Idiomas</div>
					<div className="text-lg font-semibold">{sectionCounts.languages}</div>
				</div>
				<div className="p-3 bg-white border border-slate-200 rounded-lg text-center">
					<div className="text-xs text-slate-400">Sistemas</div>
					<div className="text-lg font-semibold">{sectionCounts.systems}</div>
				</div>
				<div className="p-3 bg-white border border-slate-200 rounded-lg text-center">
					<div className="text-xs text-slate-400">Experiencia</div>
					<div className="text-lg font-semibold">{sectionCounts.experience}</div>
				</div>
				<div className="p-3 bg-white border border-slate-200 rounded-lg text-center">
					<div className="text-xs text-slate-400">Disponibilidad</div>
					<div className="text-lg font-semibold">{sectionCounts.availability}</div>
				</div>
			</div>

			{/* Tabs */}
			<div className="bg-white border border-slate-200 rounded-lg p-3">
				<nav className="flex gap-2 overflow-x-auto pb-2">
					{[
						{ key: 'overview', label: 'Resumen' },
						{ key: 'education', label: `Formación (${sectionCounts.educations})` },
						{ key: 'trainings', label: `Capacitaciones (${sectionCounts.trainings})` },
						{ key: 'languages', label: `Idiomas (${sectionCounts.languages})` },
						{ key: 'systems', label: `Sistemas (${sectionCounts.systems})` },
						{ key: 'experience', label: `Experiencia (${sectionCounts.experience})` },
						{ key: 'availability', label: `Disponibilidad (${sectionCounts.availability})` },
					].map(t => (
						<button
							key={t.key}
							onClick={() => setActiveTab(t.key as any)}
							className={`px-3 py-2 rounded-md text-md ${activeTab === t.key ? 'bg-slate-100 text-slate-900 font-medium' : 'text-slate-600'}`}
						>
							{t.label}
						</button>
					))}
				</nav>

				<div className="pt-4">
					{/* OVERVIEW */}
					{activeTab === 'overview' && (
						<div className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Información personal</CardTitle>
								</CardHeader>
								<CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-md text-slate-700">
									<div className="space-y-3">
										<div>
											<strong>Nombre:</strong> <EmptyHint value={profile.fullName} />
										</div>
										<div>
											<strong>Código:</strong> <EmptyHint value={profile.studentCode} />
										</div>
										<div>
											<strong>Identificación:</strong> <EmptyHint value={profile.idNumber} />
										</div>
										<div>
											<strong>Correo electrónico:</strong> <EmptyHint value={profile.email} />
										</div>
										<div>
											<strong>Teléfono:</strong> <EmptyHint value={profile.phone} />
										</div>
										<div>
											<strong>Dirección:</strong> <EmptyHint value={profile.address} />
										</div>
										<div>
											<strong>Sexo:</strong> <EmptyHint value={profile.gender} />
										</div>
										<div>
											<strong>Fecha de nacimiento:</strong> <EmptyHint value={formatDate(profile.birthDate)} />
										</div>
										<div>
											<strong>Edad:</strong> <EmptyHint value={profile.age ? `${profile.age} años` : undefined} />
										</div>
									</div>

									<div className="space-y-3">
										<div>
											<strong>Programa:</strong> <EmptyHint value={profile.planName} />
										</div>
										<div>
											<strong>Código del programa:</strong> <EmptyHint value={profile.planCode} />
										</div>
										<div>
											<strong>Semestre:</strong> <EmptyHint value={profile.semester} />
										</div>
										<div>
											<strong>Sede:</strong> <EmptyHint value={profile.campus} />
										</div>
										<div>
											<strong>Periodo académico:</strong> <EmptyHint value={profile.academicPeriod} />
										</div>
										<div>
											<strong>Jornada:</strong> <EmptyHint value={profile.jornada} />
										</div>
										<div>
											<strong>Contacto de emergencia:</strong> <EmptyHint value={profile.emergencyContact} />
										</div>
										<div>
											<strong>Teléfono de emergencia:</strong> <EmptyHint value={profile.emergencyPhone} />
										</div>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Documentos</CardTitle>
								</CardHeader>

								<CardContent>
									<div className="flex justify-left gap-10">
										<div className="flex flex-col items-center text-center">
											<div className="text-md font-medium text-slate-700 mb-2">Foto</div>
											{profile.Photo ? (
												<a href={profile.Photo} target="_blank" rel="noreferrer">
													<img
														src={profile.Photo}
														alt="Foto del estudiante"
														className="w-28 h-28 object-cover rounded-md border border-slate-300 shadow-sm"
													/>
												</a>
											) : (
												<p className="text-sm text-slate-500 italic">No cargada</p>
											)}
										</div>

										<div className="flex flex-col items-center text-center">
											<div className="text-md font-medium text-slate-700 mb-2">Certificado de notas</div>
											{profile.Grades ? (
												<a
													href={profile.Grades}
													target="_blank"
													rel="noreferrer"
													className="text-indigo-600 underline text-sm font-medium"
												>
													Ver certificado
												</a>
											) : (
												<p className="text-sm text-slate-500 italic">No cargado</p>
											)}
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					)}

					{/* EDUCATION */}
					{activeTab === 'education' && (
						<div className="space-y-3">
							{profile.educations && profile.educations.length > 0 ? (
								profile.educations.map(edu => (
									<div key={edu.id} className="border border-slate-200 bg-white rounded-xl p-4 shadow-sm">
										<div className="flex justify-between items-start gap-4">
											<div className="min-w-0">
												<p className="font-semibold text-slate-800 text-md truncate">
													Titulo obtenido: {edu.degreeTitle ?? 'Título no registrado'}
												</p>
												<p className="text-md text-slate-600 mt-1">
													Institución: {edu.institution ?? 'Institución no registrada'}
												</p>
												<p className="text-md text-slate-500 mt-1">
													Ciudad: {edu.city ?? 'Ciudad no registrada'}{' '}
													{edu.endYear ? `-- Año finalización: ${edu.endYear}` : 'Año no registrado'}
												</p>
											</div>
											<div className="font-semibold text-right text-md text-slate-800 space-y-1">
												<div>
													{edu.level
														? (educationLevel[edu.level] ?? 'Nivel académico no registrado')
														: 'Nivel académico no registrado'}
												</div>
												<div>{edu.semesters ? `${edu.semesters} Semestres.` : null}</div>
											</div>
										</div>
									</div>
								))
							) : (
								<p className="text-sm text-slate-500">No hay formación académica registrada.</p>
							)}
						</div>
					)}

					{/* TRAININGS */}
					{activeTab === 'trainings' && (
						<div className="space-y-3">
							{profile.trainings && profile.trainings.length > 0 ? (
								profile.trainings.map(t => (
									<div key={t.id} className="border border-slate-200 bg-white rounded-xl p-4 shadow-sm">
										<div className="flex justify-between items-start gap-4">
											<div className="min-w-0">
												<p className="font-semibold text-slate-800 text-md truncate">
													Nombre de la capacitación: {t.courseName ?? 'Curso no registrado'}
												</p>
												<p className="text-md text-slate-600 mt-1">
													Institución: {t.institution ?? 'Institución no registrada'}
												</p>
												<p className="text-md text-slate-500 mt-1">
													Duración: {t.duration ?? ''}{' '}
													{t.endDate ? `-- Fecha finalización: ${formatDate(t.endDate)}` : 'Fecha no registrada'}
												</p>
											</div>
										</div>
									</div>
								))
							) : (
								<p className="text-sm text-slate-500">No hay capacitaciones registradas.</p>
							)}
						</div>
					)}

					{/* LANGUAGES */}
					{activeTab === 'languages' && (
						<div className="space-y-3">
							{profile.languages && profile.languages.length > 0 ? (
								<div className="flex flex-wrap gap-3">
									{profile.languages.map(l => (
										<div
											key={l.id}
											className="border border-slate-200 rounded-lg px-4 py-3 bg-white shadow-sm w-full sm:w-auto"
										>
											<p className="font-semibold text-slate-800 text-md mb-2">Idioma: {l.language}</p>

											<div className="flex flex-wrap gap-x-8 text-sm text-slate-600">
												<span>
													<strong>Habla:</strong>{' '}
													{l.speakLevel ? (languageLevels[l.speakLevel] ?? 'No especificado') : 'No especificado'}
												</span>
												<span>
													<strong>Escritura:</strong>{' '}
													{l.writeLevel ? (languageLevels[l.writeLevel] ?? 'No especificado') : 'No especificado'}
												</span>
												<span>
													<strong>Lectura:</strong>{' '}
													{l.readLevel ? (languageLevels[l.readLevel] ?? 'No especificado') : 'No especificado'}
												</span>
											</div>
										</div>
									))}
								</div>
							) : (
								<p className="text-sm text-slate-500">No hay idiomas registrados.</p>
							)}
						</div>
					)}

					{/* SYSTEMS */}
					{activeTab === 'systems' && (
						<div className="space-y-3">
							{profile.systems && profile.systems.length > 0 ? (
								<div className="space-y-2">
									{profile.systems.map(s => (
										<div
											key={s.id}
											className="flex justify-between items-center border border-slate-200 bg-white px-4 py-2 rounded-lg shadow-sm hover:bg-slate-50 transition"
										>
											<span className="font-medium text-slate-700">{s.programName}</span>
										</div>
									))}
								</div>
							) : (
								<p className="text-sm text-slate-500">No hay sistemas registrados.</p>
							)}
						</div>
					)}

					{/* EXPERIENCE */}
					{activeTab === 'experience' && (
						<div className="space-y-3">
							{profile.workExperiences && profile.workExperiences.length > 0 ? (
								profile.workExperiences.map(exp => (
									<div key={exp.id} className="border border-slate-200 bg-white rounded-xl p-4 shadow-sm">
										<div className="flex justify-between items-start gap-4">
											<div className="min-w-0">
												<p className="font-semibold text-slate-800 text-md truncate">
													Cargo: {exp.role ?? 'Cargo no registrado'}
												</p>
												<p className="text-md text-slate-600 mt-1">
													Nombre empresa: {exp.companyName ?? 'Empresa no registrada'}
												</p>
												<p className="text-md text-slate-500 mt-1">
													Fecha: {exp.startDate ? formatDate(exp.startDate) : 'No registrado'} —{' '}
													{exp.endDate ? formatDate(exp.endDate) : 'Presente'}
												</p>
												{exp.functions && <p className="text-md text-slate-500 mt-1">Funciones: {exp.functions}</p>}
											</div>
										</div>
									</div>
								))
							) : (
								<p className="text-sm text-slate-500">No hay experiencia laboral registrada.</p>
							)}
						</div>
					)}

					{/* AVAILABILITY */}
					{activeTab === 'availability' && (
						<div className="space-y-3">
							{profile.availabilities && profile.availabilities.length > 0 ? (
								<div className="overflow-x-auto">
									<table className="table-auto w-full border-collapse border border-slate-200 text-sm">
										<thead className="bg-slate-100">
											<tr>
												<th className="p-2 border border-slate-200 text-left">Día</th>
												<th className="p-2 border border-slate-200 text-center">De</th>
												<th className="p-2 border border-slate-200 text-center">Hasta</th>
												<th className="p-2 border border-slate-200 text-center">De</th>
												<th className="p-2 border border-slate-200 text-center">Hasta</th>
												<th className="p-2 border border-slate-200 text-center">De</th>
												<th className="p-2 border border-slate-200 text-center">Hasta</th>
											</tr>
										</thead>
										<tbody>
											{profile.availabilities.map(a => {
												const daysOfWeek: Record<string, string> = {
													MONDAY: 'Lunes',
													TUESDAY: 'Martes',
													WEDNESDAY: 'Miércoles',
													THURSDAY: 'Jueves',
													FRIDAY: 'Viernes',
													SATURDAY: 'Sábado',
													SUNDAY: 'Domingo',
												};

												return (
													<tr key={a.id} className="border-t border-slate-200 hover:bg-slate-50">
														<td className="p-2 font-medium text-slate-700 border border-slate-200">
															{daysOfWeek[a.dayOfWeek ?? ''] ?? 'No especificado'}
														</td>
														<td className="p-2 text-center border border-slate-200">{formatTime(a.startTime1)}</td>
														<td className="p-2 text-center border border-slate-200">{formatTime(a.endTime1)}</td>
														<td className="p-2 text-center border border-slate-200">{formatTime(a.startTime2)}</td>
														<td className="p-2 text-center border border-slate-200">{formatTime(a.endTime2)}</td>
														<td className="p-2 text-center border border-slate-200">{formatTime(a.startTime3)}</td>
														<td className="p-2 text-center border border-slate-200">{formatTime(a.endTime3)}</td>
													</tr>
												);
											})}
										</tbody>
									</table>
								</div>
							) : (
								<p className="text-sm text-slate-500">No hay disponibilidad registrada.</p>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
