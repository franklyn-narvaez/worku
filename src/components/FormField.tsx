"use client";

import React from 'react';
import { useFormContext, RegisterOptions } from 'react-hook-form';

interface FormFieldProps {
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
    rules?: RegisterOptions;
}

export const FormField: React.FC<FormFieldProps> = ({
    name,
    label,
    type = 'text',
    placeholder,
    rules,
}) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    const error = errors[name]?.message as string;

    return (
        <div className="mb-2">
            <label htmlFor={name} className="text-slate-900 mb-2 block text-sm">
                {label}
            </label>
            <input
                id={name}
                type={type}
                placeholder={placeholder}
                {...register(name, rules)}
                className={`p-3 rounded block bg-[#D9D9D9] text-slate-900 w-full border ${error ? "border-red-500" : "border-slate-700"}`}
            />
            {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
        </div>
    );
};
