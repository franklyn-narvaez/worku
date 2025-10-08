import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { toast } from "react-toastify";
import { LoginSchema, type LoginType } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/FormField";

function Login() {
	const methods = useForm<LoginType>({ resolver: zodResolver(LoginSchema) });

	const navigate = useNavigate();

	const { login, status } = useAuth();

	if (status === "unresolved") {
		return <div>Loading...</div>;
	}

	if (status === "authenticated") {
		return <Navigate to="/dashboard" />;
	}

	const onSubmit: SubmitHandler<LoginType> = async (data) => {
		const res = await login(data.email, data.password);
		// Usamos el mismo patrón que en register
		if (res.status === 400) return toast.error("Datos invalidos.");
		if (res.status === 401)
			return toast.error("Usuario o contraseña no válidos.");
		if (res.status === 500)
			return toast.error("Error del servidor, intenta nuevamente.");

		if (res.status === 200) {
			toast.success("¡Inicio de sesión exitoso!");
			navigate("/dashboard");
		}
	};

	return (
		<div className="h-[calc(100vh-7rem)] flex items-center justify-center">
			<FormProvider {...methods}>
				<form onSubmit={methods.handleSubmit(onSubmit)} className="w-1/4">
					<h1 className="text-text-title font-bold text-4xl mb-4">
						Inicio de sesión
					</h1>
					<FormField
						name="email"
						label="Correo electrónico"
						placeholder="Ingresa tu correo electrónico"
					/>

					<FormField
						type="password"
						name="password"
						placeholder="Ingresa tu contraseña"
						label="Contraseña"
					/>

					<button
						type="submit"
						className="w-full button-create p-3 rounded-lg mt-2"
					>
						Iniciar sesión
					</button>
				</form>
			</FormProvider>
		</div>
	);
}

export default Login;
