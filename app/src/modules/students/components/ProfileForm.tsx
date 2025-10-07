import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
    ProfileSchema,
    type ProfileType,
} from "../schema/Profile";

import BasicForm from "./BasicForm";
import EducationForm from "./EducationForm";
import TrainingForm from "./TrainingForm";
import LanguageForm from "./LanguageForm";
import { SystemSkillsForm } from "./SystemSkillsForm";
import WorkExperienceForm from "./WorkExperienceForm";

import { STUDENT_PROFILE, UPDATE_PROFILE, VIEW_PROFILE } from "@/constants/path";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import AvailabilityForm from "./AvailabilityForm";
import type { DayOfWeekType } from "../schema/Availability";

const days = [
    { value: "MONDAY", label: "Lunes" },
    { value: "TUESDAY", label: "Martes" },
    { value: "WEDNESDAY", label: "Miércoles" },
    { value: "THURSDAY", label: "Jueves" },
    { value: "FRIDAY", label: "Viernes" },
    { value: "SATURDAY", label: "Sábado" },
    { value: "SUNDAY", label: "Domingo" },
];

const initialAvailability = days.map((day) => ({
    dayOfWeek: day.value as DayOfWeekType,
    startTime1: "", endTime1: "",
    startTime2: "", endTime2: "",
    startTime3: "", endTime3: "",
}));

function mergeAvailabilityData(
    availabilities: any[],
    baseAvailability: typeof initialAvailability
) {
    return baseAvailability.map((day) => {
        const match = availabilities.find(
            (a) => a.dayOfWeek === day.dayOfWeek
        );
        return {
            ...day,
            ...match,
        };
    });
}

export default function ProfileForm() {
    const navigate = useNavigate();

    const { createAuthFetchOptions } = useAuth();

    const [step, setStep] = useState(0);

    const [loading, setLoading] = useState(false);

    const [profileId, setProfileId] = useState<string | null>(null);

    const methods = useForm<ProfileType>({
        resolver: zodResolver(ProfileSchema),
        defaultValues: {
            educations: [],
            trainings: [],
            languages: [],
            systems: [],
            workExperiences: [],
            availabilities: initialAvailability,
        },
        mode: "onSubmit",
    });

    useEffect(() => {
        console.log(methods.formState.errors);
    })

    const steps = [
        { title: "Datos Básicos", component: <BasicForm /> },
        { title: "Educación", component: <EducationForm /> },
        { title: "Capacitaciones", component: <TrainingForm /> },
        { title: "Idiomas", component: <LanguageForm /> },
        { title: "Conocimientos en Sistemas", component: <SystemSkillsForm /> },
        { title: "Experiencia Laboral", component: <WorkExperienceForm /> },
        { title: "Disponibilidad", component: <AvailabilityForm /> },
    ];

    const totalSteps = steps.length;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const authOptions = await createAuthFetchOptions();
                const response = await fetch(VIEW_PROFILE, authOptions);

                if (response.ok) {
                    const data = await response.json();
                    console.log("Perfil cargado:", data);

                    // Guardamos el ID para saber si debemos hacer PUT
                    setProfileId(data.id);

                    const mergedAvailabilities = mergeAvailabilityData(
                        data.availabilities || [],
                        initialAvailability
                    );

                    methods.reset({
                        ...data,
                        educations: data.educations || [],
                        trainings: data.trainings || [],
                        languages: data.languages || [],
                        systems: (data.systems || []).map((s: any) => ({
                            programName: s.programName,
                        })),
                        workExperiences: data.workExperiences || [],
                        availabilities: mergedAvailabilities,
                    });
                } else if (response.status === 404) {
                    console.log("No hay perfil creado aún");
                } else {
                    const errorData = await response.json();
                    console.error("Error al cargar perfil:", errorData);
                    toast.error("Error al cargar el perfil existente.");
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                toast.error("Error al conectar con el servidor.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [createAuthFetchOptions, methods.reset]);

    const onSubmit: SubmitHandler<ProfileType> = async (data) => {
        const educations = data.educations.map((edu) => ({
            ...edu,
            semesters: edu.semesters ? Number(edu.semesters) : null,
        }));

        data = { ...data, educations };

        const authOptions = await createAuthFetchOptions();

        const isUpdating = !!profileId;
        const url = isUpdating ? UPDATE_PROFILE : STUDENT_PROFILE;
        const method = isUpdating ? "PATCH" : "POST";

        const fetchOptions = {
            ...authOptions,
            method,
            headers: {
                "Content-Type": "application/json",
                ...(authOptions.headers || {}),
            },
            body: JSON.stringify(data),
        };

        try {
            const response = await fetch(url, fetchOptions);

            if (response.ok) {
                toast.success(
                    isUpdating
                        ? "Perfil actualizado exitosamente 🎉"
                        : "Perfil creado exitosamente 🎉"
                );
                navigate("/dashboard");
            } else {
                const errorData = await response.json();
                console.error("Error guardando perfil:", errorData);
                toast.error("Ocurrió un error al guardar el perfil.");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            toast.error("Error al conectar con el servidor.");
        }
    };

    /** Avanzar al siguiente paso validando la sección actual */
    const handleNext = async () => {
        setStep((prev) => {
            if (prev === 0) {
                methods.trigger(
                    [
                        "studentCode", "lastName", "secondLastName", "fullName",
                        "planCode", "planName", "semester", "campus", "academicPeriod", "jornada",
                        "gender", "birthDate", "age", "birthPlace",
                        "idNumber", "idIssuedPlace", "maritalStatus", "dependents", "familyPosition",
                        "address", "stratum", "neighborhood", "city", "department",
                        "email", "phone", "mobile",
                        "emergencyContact", "emergencyPhone", "occupationalProfile"
                    ]
                );
            }
            if (Object.keys(methods.formState.errors).length > 0) {
                toast.error("Por favor, corrija los errores antes de continuar.");
                return prev;
            }

            return Math.min(prev + 1, totalSteps - 1)
        });
    };

    const handlePrev = () => {
        setStep((prev) => Math.max(prev - 1, 0));
    };

    if (loading) {
        return <p className="text-center text-lg">Cargando perfil...</p>;
    }

    return (
        <div className="min-h-screen w-full overflow-y-auto">
            <div className="max-w-7xl mx-auto py-8 px-4">
                <FormProvider {...methods}>
                    <form
                        onSubmit={methods.handleSubmit(onSubmit)}
                        className="bg-white p-6 rounded-lg shadow-lg space-y-8"
                    >
                        {/* Barra de progreso */}
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                            <div
                                className="bg-green-500 h-3 rounded-full transition-all duration-300"
                                style={{
                                    width: `${((step + 1) / totalSteps) * 100}%`,
                                }}
                            ></div>
                        </div>

                        {/* Header de pasos */}
                        <div className="flex justify-between mb-6">
                            {steps.map((s, index) => (
                                <div
                                    key={s.title}
                                    className={`flex-1 text-center text-sm font-medium transition-colors duration-200
                                        ${index === step
                                            ? "text-green-600 font-bold"
                                            : "text-gray-400"
                                        }
                                    `}
                                >
                                    {s.title}
                                </div>
                            ))}
                        </div>

                        {/* Contenido dinámico del paso actual */}
                        <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                            {steps[step].component}
                        </div>

                        {/* Botones de navegación */}
                        <div className="flex justify-between gap-x-2 mt-6">
                            {step > 0 && (
                                <button
                                    type="button"
                                    onClick={handlePrev}
                                    className="w-1/3 bg-gray-300 text-black p-3 rounded-lg hover:bg-gray-400 transition"
                                >
                                    Atrás
                                </button>
                            )}

                            {step < totalSteps - 1 && (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="w-2/3 bg-[#2c2c2c] text-white p-3 rounded-lg hover:bg-green-600 transition"
                                >
                                    Siguiente
                                </button>
                            )}

                            {step === totalSteps - 1 && (
                                <button
                                    type="submit"
                                    className="w-2/3 bg-[#2c2c2c] text-white p-3 rounded-lg hover:bg-green-600 transition"
                                    disabled={methods.formState.isSubmitting}
                                >
                                    {profileId ? "Actualizar Datos" : "Crear Perfil"}
                                </button>
                            )}
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}
