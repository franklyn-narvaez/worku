// src/modules/student/components/WorkExperienceForm.tsx
import { useFieldArray, useFormContext } from "react-hook-form";
import { FormField } from "@/components/FormField";
import { DatePickerField } from "@/components/DatePicker";

export default function WorkExperienceForm() {
    const { control } = useFormContext();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "workExperiences",
    });

    console.log(fields);

    return (
        <div className="mt-6">
            <h1 className="text-3xl font-bold mb-4">Experiencia Laboral</h1>

            {fields.map((field, index) => (
                <div
                    key={field.id}
                    className="border border-gray-200 rounded-lg p-4 mb-4 space-y-4"
                >
                    <FormField
                        name={`workExperiences.${index}.companyName`}
                        label="Nombre de la Empresa"
                        placeholder="Ej: Google"
                    />

                    <FormField
                        name={`workExperiences.${index}.role`}
                        label="Cargo"
                        placeholder="Ej: Desarrollador Full Stack"
                    />

                    <FormField
                        name={`workExperiences.${index}.functions`}
                        label="Funciones"
                        type="textarea"
                        placeholder="Describe las responsabilidades principales"
                    />

                    <FormField
                        name={`workExperiences.${index}.achievements`}
                        label="Logros"
                        type="textarea"
                        placeholder="Describe logros relevantes (opcional)"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            name={`workExperiences.${index}.bossName`}
                            label="Nombre del jefe inmediato"
                            placeholder="Ej: Juan Pérez"
                        />
                        <FormField
                            name={`workExperiences.${index}.bossRole`}
                            label="Cargo del jefe inmediato"
                            placeholder="Ej: Gerente de Tecnología"
                        />
                    </div>

                    <FormField
                        name={`workExperiences.${index}.bossPhone`}
                        label="Teléfono del jefe inmediato"
                        placeholder="Ej: 3001234567"
                    />

                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                        <DatePickerField
                            name={`workExperiences.${index}.startDate`}
                            label="Fecha de inicio"
                            rules={{ required: "La fecha de inicio es obligatoria" }}
                        />
                        <DatePickerField
                            name={`workExperiences.${index}.endDate`}
                            label="Fecha de finalización"
                            rules={{ required: "La fecha de finalización es obligatoria" }}
                        />
                    </div>

                    {/* Botón eliminar */}
                    <div className="flex items-end">
                        <button
                            type="button"
                            onClick={() => remove(index)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                            Eliminar Experiencia
                        </button>
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={() =>
                    append({
                        companyName: "",
                        role: "",
                        functions: "",
                        achievements: "",
                        bossName: "",
                        bossRole: "",
                        bossPhone: "",
                        startDate: undefined,
                        endDate: undefined,
                    })
                }
                className="px-6 py-2 bg-[#2c2c2c] text-white rounded-lg hover:bg-green-700"
            >
                + Agregar Experiencia
            </button>
        </div>
    );
}
