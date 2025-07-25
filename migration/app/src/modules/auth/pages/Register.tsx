"use client";

import { useForm, FormProvider } from "react-hook-form";
import { useEffect, useState } from "react";
import type { College } from "@prisma/client";
import { toast } from 'react-toastify';
import registerRequests from "./request";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@components/FormField";
import { RegisterSchema, type RegisterType } from "./schema";
import { useNavigate } from "react-router-dom";

function Register() {
    const methods = useForm<RegisterType>({
        resolver: zodResolver(RegisterSchema),
    });

    const { handleSubmit, formState: { isSubmitting, isValid } } = methods;
    const navigate = useNavigate();
    const [colleges, setColleges] = useState<College[]>([]);

    useEffect(() => {
        fetch("http://localhost:3000/api/college")
            .then((res) => res.json())
            .then((data) => setColleges(data));
    }, []);

    const onSubmit = handleSubmit(async (data) => {
        const res = await registerRequests(data);
        if (res.status === 400) return toast.error("El usuario ya existe o hay un error en los datos.");
        if (res.status === 500) return toast.error("Error al registrar el usuario.");
        if (res.status === 404) return toast.error("Rol no encontrado.");
        if (res.ok) navigate('/auth/login');
    });

    return (
        <div className="h-full flex items-center justify-center">
            <FormProvider {...methods}>
                <form onSubmit={onSubmit} className="w-1/4">
                    <h1 className="text-text-title font-bold text-4xl mb-4">
                        Crear cuenta
                    </h1>

                    <FormField name="name" label="Nombre" placeholder="Ingresa tu nombre" />
                    <FormField name="lastName" label="Apellido" placeholder="Ingresa tu apellido" />
                    <FormField name="email" label="Correo electrónico" type="email" placeholder="Ingresa tu correo" />

                    <label htmlFor="collegeId" className="text-slate-900 mb-2 block text-sm">
                        Escuela
                    </label>
                    <select
                        {...methods.register("collegeId")}
                        className="p-3 rounded block mb-2 bg-[#D9D9D9] text-slate-900 w-full"
                    >
                        <option value="">Selecciona una escuela</option>
                        {colleges.map((college) => (
                            <option key={college.id} value={college.id}>{college.name}</option>
                        ))}
                    </select>
                    {methods.formState.errors.collegeId && (
                        <span className="text-red-500 text-sm">{methods.formState.errors.collegeId.message}</span>
                    )}

                    <FormField name="password" label="Contraseña" type="password" placeholder="Ingresa tu contraseña" />
                    <FormField name="confirmPassword" label="Confirmar contraseña" type="password" placeholder="Confirma tu contraseña" />

                    <button className="w-full button-create p-3 rounded-lg mt-2" disabled={isSubmitting && !isValid}>
                        Registrar
                    </button>
                </form>
            </FormProvider>
            {/* <ToastContainer /> */}
        </div>
    );
}

export default Register;
