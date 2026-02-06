import { zodResolver } from '@hookform/resolvers/zod';
import type { College, Faculty } from '@prisma/client';
import { useEffect, useState } from 'react';
import { FormProvider, type SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DatePickerField } from '@/components/DatePicker';
import { FormField } from '@/components/FormField';
import { SelectField } from '@/components/SelectField';
import { TextAreaField } from '@/components/TextAreaField';
import { ADMIN_OFFER, CREATE_OFFER, GET_COLLEGE, GET_FACULTY } from '@/constants/path';
import { useAuth } from '@/hooks/useAuth';
import { CreateSchema, type CreateType } from '../schemas/Create';

export default function OfferCreateForm() {
	const { createAuthFetchOptions } = useAuth();
	const navigate = useNavigate();

	const methods = useForm<CreateType>({
		resolver: zodResolver(CreateSchema),
	});

	const {
		handleSubmit,
		formState: { isSubmitting, isValid },
	} = methods;

	const [faculties, setFaculties] = useState<Faculty[]>([]);
	const [colleges, setColleges] = useState<College[]>([]);

	const selectedFacultyId = useWatch({
		control: methods.control,
		name: 'facultyId',
	});

	useEffect(() => {
		const fetchFaculties = async () => {
			const options = await createAuthFetchOptions();
			const res = await fetch(GET_FACULTY, options);
			const data = await res.json();
			setFaculties(Array.isArray(data) ? data : []);
		};
		fetchFaculties();
	}, [createAuthFetchOptions]);

	useEffect(() => {
		if (!selectedFacultyId) {
			setColleges([]);
			return;
		}

		const fetchCollegesByFaculty = async () => {
			const options = await createAuthFetchOptions();
			const res = await fetch(`${GET_COLLEGE}?facultyId=${selectedFacultyId}`, options);
			const data = await res.json();
			setColleges(Array.isArray(data) ? data : []);
		};

		fetchCollegesByFaculty();
	}, [selectedFacultyId, createAuthFetchOptions]);

	const handleNavigate = () => navigate(ADMIN_OFFER);

	const onSubmit: SubmitHandler<CreateType> = async data => {
		const authOptions = await createAuthFetchOptions();
		const fetchOptions = {
			...authOptions,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...(authOptions.headers || {}),
			},
			body: JSON.stringify(data),
		};

		const response = await fetch(CREATE_OFFER, fetchOptions);

		if (response.ok) {
			toast.success('Oferta creada exitosamente');
			navigate(ADMIN_OFFER);
		} else {
			const errorData = await response.json();
			toast.error(errorData.message ?? 'Error al crear el usuario');
			console.error('Error creating offer:', errorData);
		}
	};

	return (
		<div className="h-full flex items-center justify-center">
			<FormProvider {...methods}>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="bg-white/95 p-10 rounded-2xl shadow-2xl w-full max-w-4xl flex-col items-center"
				>
					<h1 className="text-text-title text-center font-bold text-4xl mb-4">Crear Oferta</h1>

					<FormField name="title" label="Titulo" type="text" placeholder="Ingrese el titulo" />
					<TextAreaField name="description" label="Descripción" placeholder="Ingrese la descripción" rows={3} />
					<TextAreaField name="requirements" label="Requisitos" placeholder="Ingrese los requisitos" rows={3} />

					<SelectField
						name="facultyId"
						label="Facultad"
						options={faculties.map(faculty => ({
							value: faculty.id,
							label: faculty.name,
						}))}
						placeholder="Selecciona una facultad"
					/>

					<SelectField
						name="collegeId"
						label="Escuela"
						options={colleges.map(college => ({
							value: college.id,
							label: college.name,
						}))}
						placeholder="Selecciona una escuela"
					/>

					<DatePickerField
						name="closeDate"
						label="Fecha de cierre"
						data-testid="closeDate"
						rules={{ required: 'La fecha de cierre es obligatoria' }}
					/>

					<div className="flex justify-between gap-x-2 mt-4">
						<button
							type="button"
							className="w-1/2 bg-slate-300 text-black p-3 rounded-lg hover:bg-slate-400 transition"
							onClick={handleNavigate}
						>
							Cancelar
						</button>
						<button type="submit" className="w-1/2 button-create p-3 rounded-lg" disabled={isSubmitting && !isValid}>
							Crear oferta
						</button>
					</div>
				</form>
			</FormProvider>
		</div>
	);
}
