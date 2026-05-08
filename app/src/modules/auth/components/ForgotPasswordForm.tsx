import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FormField } from '@/components/FormField';
import LogInUnivalle from '../../../public/LogInUnivalle.png';
import { ForgotPasswordSchema, type ForgotPasswordType } from '../schemas/forgot-password';
import { forgotPasswordRequest } from '../requests/password-recovery';

function ForgotPasswordForm() {
	const methods = useForm<ForgotPasswordType>({ resolver: zodResolver(ForgotPasswordSchema) });
	const { isSubmitting } = methods.formState;

	const onSubmit: SubmitHandler<ForgotPasswordType> = async data => {
		try {
			const res = await forgotPasswordRequest(data);

			if (res.status === 400) {
				return toast.error('Correo electrónico inválido.');
			}
			if (res.status === 500) {
				return toast.error('Error del servidor, intenta nuevamente.');
			}
			if (res.status === 200) {
				toast.success('Si el correo existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña');
				methods.reset();
			}
		} catch (error) {
			toast.error('Error al procesar tu solicitud');
			console.error(error);
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

					<h2 className="text-2xl font-bold text-center mb-2 text-gray-800">Recuperar Contraseña</h2>
					<p className="text-center text-sm text-gray-600 mb-6">
						Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
					</p>

					<FormField
						name="email"
						label="Correo electrónico"
						placeholder="Ingresa tu correo electrónico"
					/>

					<button
						type="submit"
						disabled={isSubmitting}
						className="w-full button-create p-3 rounded-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isSubmitting ? 'Enviando...' : 'Enviar enlace de recuperación'}
					</button>

					<p className="text-center text-md mt-4 text-gray-600">
						¿Recuerdas tu contraseña?{' '}
						<Link to="/auth/login" className="text-primary-red hover:underline font-medium">
							Inicia sesión
						</Link>
					</p>

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

export default ForgotPasswordForm;
