import React from 'react';
import { useFormContext, type RegisterOptions } from 'react-hook-form';

interface SelectFieldProps {
	name: string;
	label: string;
	options: { value: string; label: string }[];
	placeholder?: string;
	rules?: RegisterOptions;
}

export const SelectField: React.FC<SelectFieldProps> = ({
	name,
	label,
	options,
	placeholder = 'Seleccione una opción',
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
			<select
				id={name}
				{...register(name, rules)}
				className={`p-3 rounded block bg-[#D9D9D9] text-slate-900 w-full border ${
					error ? 'border-red-500' : 'border-slate-700'
				}`}
			>
				<option value="">{placeholder}</option>
				{options.map(opt => (
					<option key={opt.value} value={opt.value}>
						{opt.label}
					</option>
				))}
			</select>
			{error && <p className="text-red-500 text-sm mt-1">{error}</p>}
		</div>
	);
};
