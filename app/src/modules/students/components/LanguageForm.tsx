import { useFieldArray, useFormContext } from 'react-hook-form';
import { FormField } from '@/components/FormField';
import { SelectField } from '@/components/SelectField';

export default function LanguageForm() {
	const { control } = useFormContext();

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'languages',
	});

	const levelOptions = [
		{ value: 'EXCELLENT', label: 'Excelente' },
		{ value: 'GOOD', label: 'Bueno' },
		{ value: 'FAIR', label: 'Regular' },
	];

	return (
		<div className="mt-8">
			<h1 className="text-text-title font-bold text-3xl mb-6">Idiomas</h1>

			{fields.map((field, index) => (
				<div key={field.id} className="grid grid-cols-5 gap-4 p-4 border rounded-lg mb-4">
					{/* Idioma */}
					<FormField
						name={`languages.${index}.language`}
						label="Idioma"
						type="text"
						placeholder="Ej: Inglés, Francés"
					/>

					{/* Nivel Conversación */}
					<SelectField
						name={`languages.${index}.speakLevel`}
						label="Conversación"
						options={levelOptions}
						placeholder="Seleccione un nivel"
					/>

					{/* Nivel Escritura */}
					<SelectField
						name={`languages.${index}.writeLevel`}
						label="Escritura"
						options={levelOptions}
						placeholder="Seleccione un nivel"
					/>

					{/* Nivel Lectura */}
					<SelectField
						name={`languages.${index}.readLevel`}
						label="Lectura"
						options={levelOptions}
						placeholder="Seleccione un nivel"
					/>

					{/* Botón eliminar */}
					<div className="flex items-end">
						<button
							type="button"
							onClick={() => remove(index)}
							className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
						>
							Eliminar
						</button>
					</div>
				</div>
			))}

			{/* Botón para agregar idiomas */}
			<button
				type="button"
				onClick={() =>
					append({
						language: '',
						speakLevel: 'FAIR',
						writeLevel: 'FAIR',
						readLevel: 'FAIR',
					})
				}
				className="px-6 py-2 bg-[#2c2c2c] text-white rounded-lg hover:bg-green-700"
			>
				+ Agregar idioma
			</button>
		</div>
	);
}
