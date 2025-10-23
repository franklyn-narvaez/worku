import React from 'react';
import { useFormContext, type RegisterOptions } from 'react-hook-form';

interface TextAreaFieldProps {
	name: string;
	label: string;
	placeholder?: string;
	rules?: RegisterOptions;
	rows?: number; // Permite configurar el alto inicial
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({ name, label, placeholder, rules, rows = 4 }) => {
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
			<textarea
				id={name}
				placeholder={placeholder}
				rows={rows}
				{...register(name, rules)}
				className={`p-3 rounded block bg-[#D9D9D9] text-slate-900 w-full border resize-none ${
					error ? 'border-red-500' : 'border-slate-700'
				}`}
			/>
			{error && <p className="text-red-500 text-sm mt-1">{error}</p>}
		</div>
	);
};
