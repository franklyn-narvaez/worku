import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { toast } from 'react-toastify';
import { LoginSchema, type LoginType } from '../schemas/login';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from '@/components/FormField';
import LogInUnivalle from '../../../public/LogInUnivalle.png';

function LoginForm() {
	const methods = useForm<LoginType>({ resolver: zodResolver(LoginSchema) });

	const navigate = useNavigate();

	const { login } = useAuth();

	const onSubmit: SubmitHandler<LoginType> = async data => {
		const res = await login(data.email, data.password);

		if (res.status === 400) return toast.error('Datos invalidos.');
		if (res.status === 401) return toast.error('Usuario o contraseña no válidos.');
		if (res.status === 500) return toast.error('Error del servidor, intenta nuevamente.');

		if (res.status === 200) {
			toast.success('¡Inicio de sesión exitoso!');
			navigate('/dashboard');
		}
	};

	return (
		<div className="h-screen flex items-center justify-center bg-background">
			<FormProvider {...methods}>
				<form onSubmit={methods.handleSubmit(onSubmit)} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-xl flex-col items-center">
					<div className="mb-6 flex justify-center">
						<img
							src={LogInUnivalle}
							alt="Worku Logo"
							className="h-32 w-auto object-contain"
						/>
					</div>
					{/* <h1 className="text-text-title font-bold text-4xl mb-4">Inicio de sesión</h1> */}
					<FormField name="email" label="Correo electrónico" placeholder="Ingresa tu correo electrónico" />

					<FormField type="password" name="password" placeholder="Ingresa tu contraseña" label="Contraseña" />

					<button type="submit" className="w-full button-create p-3 rounded-lg mt-2">
						Iniciar sesión
					</button>

					<p className="text-center text-md mt-2 text-gray-600">
						¿No tienes cuenta?{' '}
						<Link
							to="/auth/register"
							className="text-primary-red hover:underline font-medium"
						>
							Regístrate aquí
						</Link>
					</p>
				</form>
			</FormProvider>
		</div>
	);
}

export default LoginForm;
