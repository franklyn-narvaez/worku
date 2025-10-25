import { useFieldArray, useFormContext } from 'react-hook-form';
import { FormField } from '@/components/FormField';
import { DatePickerField } from '@/components/DatePicker';

export default function TrainingForm() {
	const { control } = useFormContext();

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'trainings',
	});

	return (
		<div className="mt-8">
			<h1 className="text-text-title font-bold text-3xl mb-6">Capacitaciones</h1>

			{fields.map((field, index) => (
				<div key={field.id} className="grid grid-cols-5 gap-4 p-4 border rounded-lg mb-4">
					{/* Institución */}
					<FormField
						name={`trainings.${index}.institution`}
						label="Institución"
						type="text"
						placeholder="Nombre de la institución"
					/>

					{/* Nombre del curso */}
					<FormField
						name={`trainings.${index}.courseName`}
						label="Nombre del curso"
						type="text"
						placeholder="Ej: Curso de React"
					/>

					{/* Duración */}
					<FormField name={`trainings.${index}.duration`} label="Duración" type="text" placeholder="Ej: 40 horas" />

					{/* Fecha de finalización */}
					<DatePickerField
						name={`trainings.${index}.endDate`}
						label="Fecha de finalización"
						rules={{ required: 'La fecha de finalización es obligatoria' }}
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

			{/* Botón para agregar capacitaciones */}
			<button
				type="button"
				onClick={() =>
					append({
						institution: '',
						courseName: '',
						duration: '',
						endDate: '',
					})
				}
				className="px-6 py-2 bg-[#2c2c2c] text-white rounded-lg hover:bg-green-700"
			>
				+ Agregar capacitación
			</button>
		</div>
	);
}
