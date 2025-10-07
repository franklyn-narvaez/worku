// src/modules/student/components/EducationForm.tsx
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { FormField } from "@/components/FormField";
import { SelectField } from "@/components/SelectField";

export default function EducationForm() {
    const { control, formState: { errors } } = useFormContext();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "educations",
    });

    const educations = useWatch({
        control,
        name: "educations",
    }) || [];

    return (
        <div className="mt-8">
            <h1 className="text-text-title font-bold text-3xl mb-6">Educación</h1>

            {fields.map((field, index) => {
                const currentLevel = educations[index]?.level;

                return (
                    <div
                        key={field.id}
                        className="grid grid-cols-6 gap-4 p-4 border rounded-lg mb-4"
                    >
                        {/* Nivel educativo */}
                        <SelectField
                            name={`educations.${index}.level`}
                            label="Nivel educativo"
                            options={[
                                { value: "HIGH_SCHOOL", label: "Bachillerato" },
                                { value: "UNIVERSITY", label: "Universitario" },
                                { value: "OTHER", label: "Otro" },
                            ]}
                            placeholder="Seleccione un nivel"
                        />

                        {/* Título obtenido */}
                        <FormField
                            name={`educations.${index}.degreeTitle`}
                            label="Título Obtenido"
                            type="text"
                            placeholder="Ingrese el título"
                        />

                        {/* Año de finalización */}
                        <FormField
                            name={`educations.${index}.endYear`}
                            label="Año de finalización"
                            type="number"
                            placeholder="2025"
                        />

                        {/* Institución */}
                        <FormField
                            name={`educations.${index}.institution`}
                            label="Institución"
                            type="text"
                            placeholder="Nombre de la institución"
                        />

                        {/* Ciudad */}
                        <FormField
                            name={`educations.${index}.city`}
                            label="Ciudad"
                            type="text"
                            placeholder="Ciudad"
                        />

                        {/* Semestres: solo visible si el nivel es UNIVERSITY o OTHER */}
                        {["UNIVERSITY", "OTHER"].includes(currentLevel) && (
                            <FormField
                                name={`educations.${index}.semesters`}
                                label="Semestres cursados"
                                type="number"
                                placeholder="Número de semestres"
                            />
                        )}

                        {/* Botón para eliminar */}
                        <div className="col-span-6 flex justify-end mt-2">
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                );
            })}

            {errors.educations?.message && (
                <p className="text-red-500 text-sm mt-2">
                    {errors.educations.message as string}
                </p>
            )}

            {/* Botón para añadir más registros */}
            <button
                type="button"
                onClick={() =>
                    append({
                        level: "HIGH_SCHOOL", // Valor por defecto
                        degreeTitle: "",
                        endYear: new Date().getFullYear(),
                        institution: "",
                        city: "",
                        semesters: 0,
                    })
                }
                className="px-6 py-2 bg-[#2c2c2c] text-white rounded-lg hover:bg-green-700"
            >
                + Agregar Educación
            </button>
        </div>
    );
}
