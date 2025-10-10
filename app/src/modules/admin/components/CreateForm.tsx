import { FormField } from '@/components/FormField';
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateSchema, type CreateType } from '../schemas/Create';
import type { College, Role } from '@prisma/client';
import { useNavigate } from 'react-router-dom';
import { ADMIN_USER } from '@/constants/path';
import { useAuth } from '@/hooks/useAuth';
import { createUser } from '../requests/create';

export default function CreateForm(props: { colleges: College[]; roles: Role[] }) {
	const { createAuthFetchOptions } = useAuth();

	const methods = useForm<CreateType>({
		resolver: zodResolver(CreateSchema),
	});

	const {
		handleSubmit,
		formState: { isSubmitting, isValid },
	} = methods;

	const navigate = useNavigate();

	const handleNavigate = () => {
		navigate(ADMIN_USER);
	};

	const onSubmit: SubmitHandler<CreateType> = async data => {
		const authOptions = await createAuthFetchOptions();

		const response = await createUser(data, authOptions);

		if (response.ok) {
			navigate(ADMIN_USER);
		} else {
			const errorData = await response.json();
			console.error('Error creating user:', errorData);
		}
	};

	return (
		<div className="h-full flex items-center justify-center">
			<FormProvider {...methods}>
				<form onSubmit={handleSubmit(onSubmit)} className="w-1/2">
					<h1 className="text-text-title font-bold text-4xl mb-4">Crear Usuario</h1>
					<FormField name="name" label="Nombre" type="text" placeholder="Ingrese su nombre" />
					<FormField name="lastName" label="Apellido" type="text" placeholder="Ingrese su apellido" />
					<FormField name="email" label="Correo Electrónico" placeholder="Ingrese su correo electrónico" />

					<label htmlFor="collegeId" className="text-slate-900 mb-2 block text-sm">
						Escuela
					</label>
					<select
						{...methods.register('collegeId')}
						className="p-3 rounded block mb-2 bg-[#D9D9D9] text-slate-900 w-full"
					>
						<option value="">Selecciona una escuela</option>
						{props.colleges.map(college => (
							<option key={college.id} value={college.id}>
								{college.name}
							</option>
						))}
					</select>
					{methods.formState.errors.collegeId && (
						<span className="text-red-500 text-sm">{methods.formState.errors.collegeId.message}</span>
					)}

					<label htmlFor="roleId" className="text-slate-900 mb-2 block text-sm">
						Rol
					</label>
					<select {...methods.register('roleId')} className="p-3 rounded block mb-2 bg-[#D9D9D9] text-slate-900 w-full">
						<option value="">Selecciona un rol</option>
						{props.roles.map(role => (
							<option key={role.id} value={role.id}>
								{role.name}
							</option>
						))}
					</select>
					{methods.formState.errors.roleId && (
						<span className="text-red-500 text-sm">{methods.formState.errors.roleId.message}</span>
					)}

					<div className="flex justify-between gap-x-2 mt-4">
						<button type="submit" className="w-1/2 button-create p-3 rounded-lg" disabled={isSubmitting && !isValid}>
							Crear
						</button>
						<button
							type="button"
							className="w-1/2 bg-slate-300 text-black p-3 rounded-lg hover:bg-slate-400 transition"
							onClick={handleNavigate}
						>
							Cancelar
						</button>
					</div>
				</form>
			</FormProvider>
		</div>
	);
}
