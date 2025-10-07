import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { toast } from "react-toastify";

interface LoginFormData {
	email: string;
	password: string;
}

function Login() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>();

	const navigate = useNavigate();

	const [error] = useState("");

	const { login, status } = useAuth();

	if (status === "unresolved") {
		return <div>Loading...</div>;
	}

	if (status === "authenticated") {
		return <Navigate to="/dashboard" />;
	}

	const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
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
			<form onSubmit={handleSubmit(onSubmit)} className="w-1/4">
				{error && (
					<span className="bg-red-500 text-xl mb-2 p-3 block">{error}</span>
				)}

				<h1 className="text-text-title font-bold text-4xl mb-4">
					Inicio de sesión
				</h1>
				<label htmlFor="email" className="text-slate-900 mb-2 block text-sm">
					Correo electrónico
				</label>
				<input
					type="email"
					{...register("email", {
						required: { value: true, message: "Este campo es obligatorio" },
					})}
					className="p-3 rounded block mb-2 bg-[#D9D9D9] text-slate-900 w-full"
					placeholder="Ingresa tu correo electrónico"
				/>
				{errors.email && (
					<span className="text-red-500 text-sm">
						{errors.email.message as string}
					</span>
				)}

				<label htmlFor="password" className="text-slate-900 mb-2 block text-sm">
					Contraseña
				</label>
				<input
					type="password"
					{...register("password", {
						required: { value: true, message: "Este campo es obligatorio" },
					})}
					className="p-3 rounded block mb-2 bg-[#D9D9D9] text-slate-900 w-full"
					placeholder="Ingresa tu contraseña"
				/>
				{errors.password && (
					<span className="text-red-500 text-sm">
						{errors.password.message as string}
					</span>
				)}

				<button
					type="submit"
					className="w-full button-create p-3 rounded-lg mt-2"
				>
					Iniciar sesión
				</button>
			</form>
		</div>
	);
}

export default Login;
