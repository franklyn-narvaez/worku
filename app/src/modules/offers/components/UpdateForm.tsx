import { FormField } from "@/components/FormField";
import type { College, Faculty, Offer } from "@prisma/client";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import {
    BASE_OFFER,
    UPDATE_OFFER,
} from "@/constants/path";
import { SelectField } from "@/components/SelectField";
import { DatePickerField } from "@/components/DatePicker";
import { TextAreaField } from "@/components/TextAreaField";
import { UpdateSchema, type UpdateType } from "../schemas/Update";

type UpdateFormProps = {
    offer: Offer & {
        college: {
            id: string;
            name: string;
        } | null;
        faculty: {
            id: string;
            name: string;
        } | null;
    };
    college?: College[];
    faculty?: Faculty[];
};
export default function UpdateForm({ offer, college, faculty }: UpdateFormProps) {
    const methods = useForm({
        resolver: zodResolver(UpdateSchema),
        defaultValues: {
            title: offer.title,
            description: offer.description ?? "",
            requirements: offer.requirements ?? undefined,
            collegeId: offer.collegeId || "",
            facultyId: offer.facultyId || "",
            closeDate: offer.closeDate ? new Date(offer.closeDate) : null,
            status: offer.status ? "true" : "false", // Convert boolean to string for the select field  
        },
    });

    const {
        handleSubmit,
        formState: { isSubmitting, isValid },
    } = methods;

    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(BASE_OFFER);
    };

    const onSubmit: SubmitHandler<UpdateType> = async (data) => {
        const newData = {
            ...data,
            id: offer.id,
            status: data.status === 'true' ? true : false // Ensure the ID of the user being updated is included
        };
        const response = await fetch(UPDATE_OFFER, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newData),
        });

        if (response.ok) {
            navigate(BASE_OFFER);
        } else {
            const errorData = await response.json();
            console.error("Error creating user:", errorData);
        }
    };

    return (
        <div className="h-full flex items-center justify-center">
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="w-1/2">
                    <h1 className="text-text-title font-bold text-4xl mb-4">Actualizar Oferta</h1>
                    <FormField name="title" label="Titulo" type="text" placeholder="Ingrese el titulo" />
                    <TextAreaField name="description" label="Descripción" placeholder="Ingrese la descripción" rows={3} />
                    <TextAreaField name="requirements" label="Requisitos" placeholder="Ingrese los requisitos" rows={3} />

                    <SelectField
                        name="collegeId"
                        label="Escuela"
                        options={college?.map((college) => ({
                            value: college.id,
                            label: college.name
                        })) ?? []}
                        placeholder="Selecciona una escuela"
                    />

                    <SelectField
                        name="facultyId"
                        label="Facultad"
                        options={faculty?.map((faculty) => ({
                            value: faculty.id,
                            label: faculty.name
                        })) ?? []}
                        placeholder="Selecciona una facultad"
                    />

                    <SelectField
                        name="status"
                        label="Estado"
                        options={[
                            { value: "true", label: "Activa" },
                            { value: "false", label: "Inactiva" }
                        ]}
                        placeholder="Selecciona un estado"
                    />

                    <DatePickerField
                        name="closeDate"
                        label="Fecha de cierre"
                        rules={{ required: "La fecha de cierre es obligatoria" }}
                    />

                    <div className="flex justify-between gap-x-2 mt-4">
                        <button
                            type="button"
                            className="w-1/2 bg-slate-300 text-black p-3 rounded-lg hover:bg-slate-400 transition"
                            onClick={handleNavigate}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="w-1/2 button-create p-3 rounded-lg"
                            disabled={isSubmitting && !isValid}
                        >
                            Actualziar oferta
                        </button>
                    </div>


                </form>
            </FormProvider>
        </div>
    )
}
