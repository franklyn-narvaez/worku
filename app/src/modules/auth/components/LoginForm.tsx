import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FormField } from '@/components/FormField';
import { useAuth } from '../../../hooks/useAuth';
import LogInUnivalle from '../../../public/LogInUnivalle.png';
import { LoginSchema, type LoginType } from '../schemas/login';

function LoginForm() {
	const methods = useForm<LoginType>({ resolver: zodResolver(LoginSchema) });

	const { login } = useAuth();

	const onSubmit: SubmitHandler<LoginType> = async data => {
		const res = await login(data.email, data.password);

		if (res.status === 400) return toast.error('Datos invalidos.');
		if (res.status === 401) return toast.error('Usuario o contraseña no válidos.');
		if (res.status === 500) return toast.error('Error del servidor, intenta nuevamente.');
		if (res.status === 200) {
			toast.success('¡Inicio de sesión exitoso!');
		}
	};

	return (
		<div className="min-h-screen w-full overflow-y-auto flex items-center justify-center bg-login-image pt-8 pb-7">
			<FormProvider {...methods}>
				<form
					onSubmit={methods.handleSubmit(onSubmit)}
					className="bg-white/95 p-8 rounded-2xl shadow-2xl border border-gray-400 w-full max-w-xl flex-col items-center my-auto"
				>
					<div className="mb-6 flex justify-center">
						<img src={LogInUnivalle} alt="Worku Logo" className="h-32 w-auto object-contain" />
					</div>
					<FormField name="email" label="Correo electrónico" placeholder="Ingresa tu correo electrónico" />

					<FormField type="password" name="password" placeholder="Ingresa tu contraseña" label="Contraseña" />
				<Link to="/auth/forgot-password" className="text-primary-red hover:underline font-medium text-sm mt-1 block text-right">
					¿Olvidaste tu contraseña?
				</Link>
					<button type="submit" className="w-full button-create p-3 rounded-lg mt-2">
						Iniciar sesión
					</button>

					<p className="text-center text-md mt-2 text-gray-600">
						¿No tienes cuenta?{' '}
						<Link to="/auth/register" className="text-primary-red hover:underline font-medium">
							Regístrate aquí
						</Link>
					</p>
				</form>
			</FormProvider>
		</div>
	);
}

export default LoginForm;
