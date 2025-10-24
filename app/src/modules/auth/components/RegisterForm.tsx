'use client';

import { useForm, FormProvider } from 'react-hook-form';
import type { College } from '@prisma/client';
import { toast } from 'react-toastify';
import { registerRequets } from '../requests/register';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from '@components/FormField';
import { RegisterSchema, type RegisterType } from '../schemas/register';
import { useNavigate } from 'react-router-dom';
import LogInUnivalle from '../../../public/LogInUnivalle.png';

function RegisterForm(props: { colleges: College[] }) {
	const methods = useForm<RegisterType>({
		resolver: zodResolver(RegisterSchema),
	});

	const {
		handleSubmit,
		formState: { isSubmitting, isValid },
	} = methods;
	const navigate = useNavigate();

	const onSubmit = handleSubmit(async data => {
		const res = await registerRequets(data);
		if (res.status === 400) return toast.error('El usuario ya existe o hay un error en los datos.');
		if (res.status === 500) return toast.error('Error al registrar el usuario.');
		if (res.status === 404) return toast.error('Rol no encontrado.');
		if (res.ok) navigate('/auth/login');
	});

	return (
		<div className="h-full flex items-center justify-center  bg-background">
			<FormProvider {...methods}>
				<form onSubmit={onSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-xl flex-col items-center">

					<div className="mb-6 flex justify-center">
						<img
							src={LogInUnivalle}
							alt="Worku Logo"
							className="h-25 w-auto object-contain"
						/>
					</div>
					{/* <h1 className="text-text-title font-bold text-4xl mb-4">Crear cuenta</h1> */}

					<FormField name="name" label="Nombre" placeholder="Ingresa tu nombre" />
					<FormField name="lastName" label="Apellido" placeholder="Ingresa tu apellido" />
					<FormField name="email" label="Correo electrónico" placeholder="Ingresa tu correo" />
					<label htmlFor="collegeId" className="text-slate-900 mb-2 block text-sm">
						Escuela
					</label>
					<select
						{...methods.register('collegeId')}
						className="p-3 rounded block mb-2 bg-[#D9D9D9] text-slate-900 w-full"
					>
						<option value="">Selecciona tu escuela</option>
						{props.colleges.map(college => (
							<option key={college.id} value={college.id}>
								{college.name}
							</option>
						))}
					</select>
					{methods.formState.errors.collegeId && (
						<span className="text-red-500 text-sm">{methods.formState.errors.collegeId.message}</span>
					)}

					<FormField name="password" label="Contraseña" type="password" placeholder="Ingresa tu contraseña" />
					<FormField
						name="confirmPassword"
						label="Confirmar contraseña"
						type="password"
						placeholder="Confirma tu contraseña"
					/>

					<button
						type="submit"
						className="w-full button-create p-3 rounded-lg mt-2"
						disabled={isSubmitting && !isValid}
					>
						Registrar
					</button>

					<p className="text-center text-sm text-gray-600 mt-4">
						¿Ya tienes una cuenta?{' '}
						<span
							onClick={() => navigate('/auth/login')}
							className="text-primary-red hover:underline cursor-pointer"
						>
							Inicia sesión
						</span>
					</p>
				</form>
			</FormProvider>
		</div>
	);
}

export default RegisterForm;
