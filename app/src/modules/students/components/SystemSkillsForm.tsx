import { useFormContext, Controller } from "react-hook-form";
import { useEffect, useState } from "react";

export function SystemSkillsForm() {
    const { control, setValue, watch, formState: { errors } } = useFormContext();

    const systems = watch("systems") || [];

    const [inputValue, setInputValue] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    const handleAddSkill = (value: string) => {
        const trimmedValue = value.trim();

        if (!trimmedValue) {
            setErrorMessage("El nombre del programa no puede estar vacío.");
            return;
        }

        if (systems.some((s: { programName: string }) => s.programName.toLowerCase() === trimmedValue.toLowerCase())) {
            setErrorMessage(`"${trimmedValue}" ya ha sido agregado.`);
            return;
        }

        const newSkills = [...systems, { programName: trimmedValue }];
        setValue("systems", newSkills, { shouldValidate: true });
        setInputValue("");
        setErrorMessage("");
    };

    const handleRemoveSkill = (index: number) => {
        const newSkills = systems.filter((_: { programName: string }, i: number) => i !== index);
        setValue("systems", newSkills, { shouldValidate: true });
        setErrorMessage("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddSkill(inputValue);
        }
    };

    useEffect(() => {
        const trimmedValue = inputValue.trim();

        if (!trimmedValue) {
            setErrorMessage("");
            return;
        }

        const isDuplicate = systems.some(
            (s: { programName: string }) =>
                s.programName.toLowerCase() === trimmedValue.toLowerCase()
        );

        if (isDuplicate) {
            setErrorMessage(`"${trimmedValue}" ya ha sido agregado.`);
        } else {
            setErrorMessage("");
        }
    }, [inputValue, systems]);


    return (
        <div className="mt-8">
            <h1 className="text-text-title font-bold text-3xl mb-6">
                Conocimientos en Sistemas
            </h1>

            <Controller
                name="systems"
                control={control}
                defaultValue={[]}
                render={() => (
                    <div className="flex flex-col gap-4">
                        {/* Input para ingresar skills */}
                        <div>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Escribe un programa y presiona Enter"
                                className={`border rounded-lg px-4 py-3 text-base w-full bg-[#D9D9D9] focus:outline-none focus:ring-2 transition-colors
                                    ${errorMessage ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-green-500"}`}
                            />
                            {errorMessage && (
                                <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
                            )}
                            {/* Mostrar error debajo del input */}
                            {errors.systems?.message && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.systems.message as string}
                                </p>
                            )}
                        </div>

                        {/* Chips dinámicos */}
                        <div className="flex flex-wrap gap-3 mt-2">
                            {systems.map((skill: { programName: string }, index: number) => (
                                <span
                                    key={skill.programName}
                                    className="flex items-center gap-2 bg-[#D9D9D9] text-slate-900 px-4 py-2 rounded-full text-base shadow-sm hover:bg-green-300 transition-colors duration-200"
                                >
                                    <span className="font-medium">{skill.programName}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSkill(index)}
                                        className="text-red-600 hover:text-red-800 text-lg font-bold focus:outline-none"
                                    >
                                        ✕
                                    </button>
                                </span>
                            ))}
                        </div>

                        {systems.length === 0 && (
                            <p className="text-gray-500 text-sm">
                                No has agregado ningún programa todavía.
                            </p>
                        )}
                    </div>
                )}
            />
        </div>
    );
}
