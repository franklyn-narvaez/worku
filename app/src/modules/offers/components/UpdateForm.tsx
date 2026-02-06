import { zodResolver } from '@hookform/resolvers/zod';
import type { College, Faculty, Offer } from '@prisma/client';
import { useEffect, useState } from 'react';
import { FormProvider, type SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DatePickerField } from '@/components/DatePicker';
import { FormField } from '@/components/FormField';
import { SelectField } from '@/components/SelectField';
import { TextAreaField } from '@/components/TextAreaField';
import { ADMIN_OFFER, GET_COLLEGE, UPDATE_OFFER } from '@/constants/path';
import { useAuth } from '@/hooks/useAuth';
import { UpdateSchema } from '../schemas/Update';

type UpdateType = {
	title: string;
	description: string;
	requirements: string;
	collegeId: string;
	facultyId: string;
	closeDate: unknown;
	status: 'true' | 'false';
};

type UpdateFormProps = {
	offer: Offer & {
		college: { id: string; name: string } | null;
		faculty: { id: string; name: string } | null;
	};
	college?: College[];
	faculty?: Faculty[];
};

export default function UpdateForm({ offer, college, faculty }: UpdateFormProps) {
	const navigate = useNavigate();
	const { createAuthFetchOptions } = useAuth();

	const methods = useForm<UpdateType>({
		resolver: zodResolver(UpdateSchema),
		defaultValues: {
			title: offer.title,
			description: offer.description ?? '',
			requirements: offer.requirements ?? '',
			collegeId: offer.collegeId || '',
			facultyId: offer.facultyId || '',
			closeDate: offer.closeDate ? new Date(offer.closeDate) : null,
			status: offer.status ? 'true' : 'false',
		},
	});

	const {
		handleSubmit,
		formState: { isSubmitting, isValid },
		control,
		setValue,
	} = methods;

	// Observamos la facultad seleccionada
	const selectedFacultyId = useWatch({
		control,
		name: 'facultyId',
	});

	const [collegesState, setCollegesState] = useState<College[]>(college ?? []);

	// Fetch dinámico de escuelas según facultad
	useEffect(() => {
		if (!selectedFacultyId) {
			setCollegesState([]);
			return;
		}

		const fetchCollegesByFaculty = async () => {
			const options = await createAuthFetchOptions();
			const res = await fetch(`${GET_COLLEGE}?facultyId=${selectedFacultyId}`, options);
			const data = await res.json();
			setCollegesState(Array.isArray(data) ? data : []);
		};

		fetchCollegesByFaculty();
	}, [selectedFacultyId, createAuthFetchOptions, setValue]);

	const handleNavigate = () => navigate(ADMIN_OFFER);

	const onSubmit: SubmitHandler<UpdateType> = async data => {
		const payload = {
			...data,
			id: offer.id,
			status: data.status === 'true',
		};

		const authOptions = await createAuthFetchOptions();
		const fetchOptions = {
			...authOptions,
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				...(authOptions.headers || {}),
			},
			body: JSON.stringify(payload),
		};

		const response = await fetch(UPDATE_OFFER, fetchOptions);
		if (response.ok) {
			toast.success('Oferta actualizada exitosamente');
			navigate(ADMIN_OFFER);
		} else {
			const errorData = await response.json();
			toast.error(errorData.message ?? 'Error al actualizar la oferta');
			console.error('Error updating offer:', errorData);
		}
	};

	return (
		<div className="h-full flex items-center justify-center">
			<FormProvider {...methods}>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="bg-white/95 p-10 rounded-2xl shadow-2xl w-full max-w-4xl flex-col items-center"
				>
					<h1 className="text-text-title text-center font-bold text-4xl mb-4">Actualizar Oferta</h1>

					<FormField name="title" label="Titulo" type="text" placeholder="Ingrese el titulo" />
					<TextAreaField name="description" label="Descripción" placeholder="Ingrese la descripción" rows={3} />
					<TextAreaField name="requirements" label="Requisitos" placeholder="Ingrese los requisitos" rows={3} />

					<SelectField
						name="facultyId"
						label="Facultad"
						options={(faculty ?? []).map(f => ({ value: f.id, label: f.name }))}
						placeholder="Selecciona una facultad"
					/>

					<SelectField
						name="collegeId"
						label="Escuela"
						options={collegesState.map(c => ({ value: c.id, label: c.name }))}
						placeholder="Selecciona una escuela"
					/>

					<SelectField
						name="status"
						label="Estado"
						options={[
							{ value: 'true', label: 'Activa' },
							{ value: 'false', label: 'Inactiva' },
						]}
						placeholder="Selecciona un estado"
					/>

					<DatePickerField
						name="closeDate"
						label="Fecha de cierre"
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
						<button type="submit" className="w-1/2 button-update p-3 rounded-lg" disabled={isSubmitting && !isValid}>
							Actualizar oferta
						</button>
					</div>
				</form>
			</FormProvider>
		</div>
	);
}
