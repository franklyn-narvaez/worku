import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FormField } from '@/components/FormField';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import LogInUnivalle from '../../../public/LogInUnivalle.png';
import { ResetPasswordSchema, type ResetPasswordType } from '../schemas/reset-password';
import { resetPasswordRequest, validateResetToken } from '../requests/password-recovery';

function ResetPasswordForm() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const [isValidating, setIsValidating] = useState(true);
	const [isTokenValid, setIsTokenValid] = useState(false);

	const token = searchParams.get('token');

	const methods = useForm<ResetPasswordType>({ resolver: zodResolver(ResetPasswordSchema) });
	const { isSubmitting } = methods.formState;

	// Validate token on component mount
	useEffect(() => {
		if (!token) {
			toast.error('Token de recuperación no encontrado');
			navigate('/auth/forgot-password');
			return;
		}

		const validateToken = async () => {
			try {
				const res = await validateResetToken(token);
				const data = await res.json();

				if (data.isValid) {
					setIsTokenValid(true);
				} else {
					toast.error(data.message || 'Token inválido o expirado');
					navigate('/auth/forgot-password');
				}
			} catch (error) {
				toast.error('Error al validar el token');
				console.error(error);
				navigate('/auth/forgot-password');
			} finally {
				setIsValidating(false);
			}
		};

		validateToken();
	}, [token, navigate]);

	const onSubmit: SubmitHandler<ResetPasswordType> = async data => {
		if (!token) return;

		try {
			const res = await resetPasswordRequest(token, data);
			const responseData = await res.json();

			if (res.status === 400) {
				return toast.error(responseData.message || 'Datos inválidos');
			}
			if (res.status === 500) {
				return toast.error('Error del servidor, intenta nuevamente.');
			}
			if (res.status === 200) {
				toast.success('¡Contraseña actualizada exitosamente!');
				navigate('/auth/login');
			}
		} catch (error) {
			toast.error('Error al actualizar la contraseña');
			console.error(error);
		}
	};

	if (isValidating) {
		return <LoadingSpinner text="Validando enlace..." />;
	}

	if (!isTokenValid) {
		return null;
	}

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

					<h2 className="text-2xl font-bold text-center mb-2 text-gray-800">Restablecer Contraseña</h2>
					<p className="text-center text-sm text-gray-600 mb-6">
						Ingresa tu nueva contraseña
					</p>

					<FormField
						type="password"
						name="password"
						label="Nueva contraseña"
						placeholder="Ingresa tu nueva contraseña"
					/>

					<FormField
						type="password"
						name="passwordConfirm"
						label="Confirmar contraseña"
						placeholder="Confirma tu nueva contraseña"
					/>

					<button
						type="submit"
						disabled={isSubmitting}
						className="w-full button-create p-3 rounded-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isSubmitting ? 'Actualizando...' : 'Actualizar Contraseña'}
					</button>

					<p className="text-center text-md mt-4 text-gray-600">
						¿Recuerdas tu contraseña?{' '}
						<a href="/auth/login" className="text-primary-red hover:underline font-medium">
							Inicia sesión
						</a>
					</p>
				</form>
			</FormProvider>
		</div>
	);
}

export default ResetPasswordForm;
