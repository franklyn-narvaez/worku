"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useFormContext, type RegisterOptions, Controller } from "react-hook-form";
import { es } from "react-day-picker/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerFieldProps {
    name: string;
    label: string;
    placeholder?: string;
    rules?: RegisterOptions;
}

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
    name,
    label,
    placeholder = "Selecciona una fecha",
    rules,
}) => {
    const {
        control,
        formState: { errors },
    } = useFormContext();

    const error = errors[name]?.message as string;

    return (
        <div className="mb-2">
            <label htmlFor={name} className="text-slate-900 mb-2 block text-sm">
                {label}
            </label>

            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field }) => (
                    <>
                        <input
                            type="date"
                            id={name}
                            value={
                                field.value
                                    ? new Date(field.value).toISOString().split("T")[0]
                                    : ""
                            }
                            onChange={(e) => field.onChange(new Date(e.target.value))}
                            className="hidden"
                        />

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={`w-full h-auto p-3 rounded bg-[#D9D9D9] hover:bg-[#D9D9D9] text-slate-900 border ${!field.value ? "text-muted-foreground" : ""
                                        } ${error ? "border-red-500" : "border-slate-700"}`}
                                >
                                    {field.value ? (
                                        format(field.value, "PPP", { locale: es })
                                    ) : (
                                        <span>{placeholder}</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => date < new Date()}
                                    captionLayout="dropdown"
                                />
                            </PopoverContent>
                        </Popover>

                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </>
                )}
            />
        </div>
    );
};
