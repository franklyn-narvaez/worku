import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { STUDENT_PROFILE, UPDATE_PROFILE, VIEW_PROFILE } from '@/constants/path';
import { useAuth } from '@/hooks/useAuth';
import type { DayOfWeekType } from '../schema/Availability';
import { ProfileSchema, type ProfileType } from '../schema/Profile';
import AvailabilityForm from './AvailabilityForm';
import BasicForm from './BasicForm';
import EducationForm from './EducationForm';
import GradesForm from './GradesForm';
import LanguageForm from './LanguageForm';
import PhotoForm from './PhotoForm';
import { SystemSkillsForm } from './SystemSkillsForm';
import TrainingForm from './TrainingForm';
import WorkExperienceForm from './WorkExperienceForm';

const days = [
	{ value: 'MONDAY', label: 'Lunes' },
	{ value: 'TUESDAY', label: 'Martes' },
	{ value: 'WEDNESDAY', label: 'Miércoles' },
	{ value: 'THURSDAY', label: 'Jueves' },
	{ value: 'FRIDAY', label: 'Viernes' },
	{ value: 'SATURDAY', label: 'Sábado' },
	{ value: 'SUNDAY', label: 'Domingo' },
];

const initialAvailability = days.map(day => ({
	dayOfWeek: day.value as DayOfWeekType,
	startTime1: '',
	endTime1: '',
	startTime2: '',
	endTime2: '',
	startTime3: '',
	endTime3: '',
}));

const steps = [
	{ title: 'Datos Básicos', component: <BasicForm /> },
	{ title: 'Educación', component: <EducationForm /> },
	{ title: 'Capacitaciones', component: <TrainingForm /> },
	{ title: 'Idiomas', component: <LanguageForm /> },
	{ title: 'Conocimientos en Sistemas', component: <SystemSkillsForm /> },
	{ title: 'Experiencia Laboral', component: <WorkExperienceForm /> },
	{ title: 'Disponibilidad', component: <AvailabilityForm /> },
	{ title: 'Foto', component: <PhotoForm /> },
	{ title: 'Notas', component: <GradesForm /> },
];

function mergeAvailabilityData(availabilities: any[], baseAvailability: typeof initialAvailability) {
	return baseAvailability.map(day => {
		const match = availabilities.find(a => a.dayOfWeek === day.dayOfWeek);
		return {
			...day,
			...match,
		};
	});
}

export default function ProfileForm() {
	const navigate = useNavigate();

	const { createAuthFetchOptions } = useAuth();

	const [step, setStep] = useState(0);

	const [loading, setLoading] = useState(false);

	const [profileId, setProfileId] = useState<string | null>(null);

	const [status, setStatus] = useState<string | null>(null);
	const [isLocked, setIsLocked] = useState(false);

	const [rejectComment, setRejectComment] = useState<string | null>(null);

	const methods = useForm<ProfileType>({
		resolver: zodResolver(ProfileSchema),
		defaultValues: {
			educations: [],
			trainings: [],
			languages: [],
			systems: [],
			workExperiences: [],
			availabilities: initialAvailability,
		},
		mode: 'onSubmit',
	});

	const totalSteps = steps.length;

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const authOptions = await createAuthFetchOptions();
				const response = await fetch(VIEW_PROFILE, authOptions);

				if (response.ok) {
					const data = await response.json();

					setStatus(data.status);
					setIsLocked(['SUBMITTED', 'APPROVED'].includes(data.status || ''));

					setProfileId(data.id);

					setRejectComment(data.rejectComment || null);

					const mergedAvailabilities = mergeAvailabilityData(data.availabilities || [], initialAvailability);

					methods.reset({
						...data,
						educations: data.educations || [],
						trainings: data.trainings || [],
						languages: data.languages || [],
						systems: (data.systems || []).map((s: any) => ({
							programName: s.programName,
						})),
						workExperiences: data.workExperiences || [],
						availabilities: mergedAvailabilities,
						photo: data.Photo || undefined,
						grades: data.Grades || undefined,
					});
				} else if (response.status === 404) {
					console.log('No hay perfil creado aún');
				} else {
					const errorData = await response.json();
					console.error('Error al cargar perfil:', errorData);
					toast.error('Error al cargar el perfil existente.');
				}
			} catch (error) {
				console.error('Error fetching profile:', error);
				toast.error('Error al conectar con el servidor.');
			} finally {
				setLoading(false);
			}
		};

		fetchProfile();
	}, [createAuthFetchOptions, methods.reset]);

	const onSubmit: SubmitHandler<ProfileType> = async profileData => {
		const educations = profileData.educations.map(edu => ({
			...edu,
			semesters: edu.semesters ? Number(edu.semesters) : null,
		}));

		profileData = { ...profileData, educations };

		const authOptions = await createAuthFetchOptions();

		const isUpdating = !!profileId;
		const url = isUpdating ? UPDATE_PROFILE : STUDENT_PROFILE;
		const method = isUpdating ? 'PATCH' : 'POST';

		const hasNewPhoto =
			profileData.photo instanceof File || (profileData.photo instanceof FileList && profileData.photo.length > 0);
		const hasNewGrades =
			profileData.grades instanceof File || (profileData.grades instanceof FileList && profileData.grades.length > 0);

		if (isUpdating && !hasNewPhoto && !hasNewGrades) {
			const fetchOptions = {
				...authOptions,
				method,
				headers: {
					'Content-Type': 'application/json',
					...(authOptions.headers || {}),
				},
				body: JSON.stringify(profileData),
			};

			try {
				const response = await fetch(url, fetchOptions);
				if (response.ok) {
					toast.success('Perfil actualizado exitosamente 🎉');
					navigate('/dashboard');
				} else {
					const errorData = await response.json();
					console.error('Error guardando perfil:', errorData);
					toast.error('Ocurrió un error al guardar el perfil.');
				}
			} catch (error) {
				console.error('Error en la solicitud:', error);
				toast.error('Error al conectar con el servidor.');
			}
			return;
		}

		const formData = new FormData();

		let photoFile: File | null = null;
		if (profileData.photo instanceof FileList && profileData.photo.length > 0) {
			photoFile = profileData.photo[0];
		} else if (profileData.photo instanceof File) {
			photoFile = profileData.photo;
		}

		let gradesFile: File | null = null;
		if (profileData.grades instanceof FileList && profileData.grades.length > 0) {
			gradesFile = profileData.grades[0];
		} else if (profileData.grades instanceof File) {
			gradesFile = profileData.grades;
		}

		if (photoFile) {
			formData.append('photo', photoFile);
		}
		if (gradesFile) {
			formData.append('grades', gradesFile);
		}

		const dataToSend = { ...profileData };

		if (!photoFile && typeof profileData.photo === 'string') {
			dataToSend.photo = profileData.photo;
		} else {
			delete dataToSend.photo;
		}

		if (!gradesFile && typeof profileData.grades === 'string') {
			dataToSend.grades = profileData.grades;
		} else {
			delete dataToSend.grades;
		}

		formData.append('profileData', JSON.stringify(dataToSend));

		const fetchOptions = {
			...authOptions,
			method,
			body: formData,
		};

		try {
			const response = await fetch(url, fetchOptions);

			if (response.ok) {
				toast.success(isUpdating ? 'Perfil actualizado exitosamente 🎉' : 'Perfil creado exitosamente 🎉');
				navigate('/dashboard');
			} else {
				const errorData = await response.json();
				console.error('Error guardando perfil:', errorData);
				toast.error('Ocurrió un error al guardar el perfil.');
			}
		} catch (error) {
			console.error('Error en la solicitud:', error);
			toast.error('Error al conectar con el servidor.');
		}
	};

	const handleSubmitForReview = async () => {
		if (!profileId) {
			toast.warning('Primero debes crear y guardar el perfil antes de enviarlo a revisión.');
			return;
		}

		const authOptions = await createAuthFetchOptions();
		try {
			const response = await fetch(`${STUDENT_PROFILE}/${profileId}/submit`, {
				...authOptions,
				method: 'PATCH',
			});

			if (response.ok) {
				toast.success('Perfil enviado a revisión correctamente ✅');
				setStatus('SUBMITTED');
				setIsLocked(true);
			} else {
				const errorData = await response.json();
				toast.error(errorData.error || 'Error al enviar el perfil a revisión.');
			}
		} catch (error) {
			console.error('Error enviando a revisión:', error);
			toast.error('Error al conectar con el servidor.');
		}
	};

	const handleNext = async () => {
		const basicFields: (keyof ProfileType)[] = [
			'studentCode',
			'lastName',
			'secondLastName',
			'fullName',
			'planCode',
			'planName',
			'semester',
			'campus',
			'academicPeriod',
			'jornada',
			'gender',
			'birthDate',
			'age',
			'birthPlace',
			'idNumber',
			'idIssuedPlace',
			'maritalStatus',
			'dependents',
			'familyPosition',
			'address',
			'stratum',
			'neighborhood',
			'city',
			'department',
			'email',
			'phone',
			'mobile',
			'emergencyContact',
			'emergencyPhone',
			'occupationalProfile',
		];

		let fieldsToValidate: (keyof ProfileType)[] = [];

		if (step === 0) fieldsToValidate = basicFields;
		if (step === 7) fieldsToValidate = ['photo'];
		if (step === 8) fieldsToValidate = ['grades'];

		if (fieldsToValidate.length > 0) {
			const valid = await methods.trigger(fieldsToValidate, { shouldFocus: true });
			if (!valid) {
				if (step === 7) {
					toast.error('Por favor selecciona una imagen válida antes de continuar.');
				} else if (step === 8) {
					toast.error('Por favor selecciona un certificado de notas válido antes de continuar.');
				} else {
					toast.error('Corrige los errores antes de continuar.');
				}
				return;
			}
		}

		setStep(prev => Math.min(prev + 1, totalSteps - 1));
	};

	const handlePrev = () => {
		setStep(prev => Math.max(prev - 1, 0));
	};

	if (loading) {
		return <p className="text-center text-lg">Cargando perfil...</p>;
	}

	return (
		<div className="min-h-screen w-full overflow-y-auto">
			<div className="max-w-7xl mx-auto py-8 px-4">
				{status === 'REJECTED' && rejectComment && (
					<div className="mb-6 p-4 border-l-4 border-red-600 bg-red-50 rounded-md">
						<h3 className="text-red-700 font-semibold mb-2">Tu perfil fue rechazado ❌</h3>
						<p className="text-red-700">
							Motivo del rechazo: <span className="italic">{rejectComment}</span>
						</p>
						<p className="text-sm text-gray-600 mt-1">
							Por favor, corrige los errores mencionados y vuelve a enviar tu perfil para revisión.
						</p>
					</div>
				)}

				<FormProvider {...methods}>
					<form onSubmit={methods.handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-lg space-y-8">
						{/* Barra de progreso */}
						<div className="w-full bg-gray-200 rounded-full h-3 mb-6">
							<div
								className="bg-green-500 h-3 rounded-full transition-all duration-300"
								style={{
									width: `${((step + 1) / totalSteps) * 100}%`,
								}}
							></div>
						</div>

						{/* Header de pasos */}
						<div className="flex justify-between mb-6">
							{steps.map((s, index) => (
								<div
									key={s.title}
									className={`flex-1 text-center text-sm font-medium transition-colors duration-200
                                        ${index === step ? 'text-green-600 font-bold' : 'text-gray-400'}
                                    `}
								>
									{s.title}
								</div>
							))}
						</div>

						{/* Contenido dinámico del paso actual */}
						<div className="p-4 border rounded-lg shadow-sm bg-gray-50">{steps[step].component}</div>

						{/* Botones de navegación */}
						<div className="flex justify-between gap-x-10 mt-6">
							{step > 0 && (
								<button
									type="button"
									onClick={handlePrev}
									className="w-1/2 bg-gray-300 text-black p-3 rounded-lg hover:bg-gray-400 transition"
								>
									Atrás
								</button>
							)}

							{step < totalSteps - 1 && (
								<button
									type="button"
									onClick={handleNext}
									className="w-1/2 bg-[#2c2c2c] text-white p-3 rounded-lg hover:bg-gray-700 transition"
								>
									Siguiente
								</button>
							)}

							{step === totalSteps - 1 && (
								<button
									type="submit"
									onClick={() => {
										console.log('Submit button clicked');
										console.log('Form valid:', methods.formState.isValid);
										console.log('Form errors:', methods.formState.errors);
										console.log('Current photo value:', methods.getValues('photo'));
									}}
									className="w-2/3 bg-[#2c2c2c] text-white p-3 rounded-lg hover:bg-green-600 transition"
									disabled={methods.formState.isSubmitting}
								>
									{profileId ? 'Actualizar Datos' : 'Crear Perfil'}
								</button>
							)}

							{/* Enviar a revisión */}
							{profileId && !['SUBMITTED', 'APPROVED'].includes(status || '') && (
								<button
									type="button"
									onClick={handleSubmitForReview}
									className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
									disabled={isLocked}
								>
									Enviar a Revisión
								</button>
							)}

							{status === 'SUBMITTED' && (
								<p className="text-center text-yellow-600 font-semibold">
									Tu perfil está en revisión. No puedes editarlo.
								</p>
							)}
							{status === 'APPROVED' && (
								<p className="text-center text-green-600 font-semibold">Tu perfil ha sido aprobado ✅</p>
							)}
						</div>
					</form>
				</FormProvider>
			</div>
		</div>
	);
}
