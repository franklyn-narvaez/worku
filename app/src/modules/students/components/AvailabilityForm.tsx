import { useFieldArray, useFormContext } from 'react-hook-form';
import { FormField } from '@/components/FormField';
import type { ProfileType } from '../schema/Profile';

const daysOfWeek = {
	MONDAY: 'Lunes',
	TUESDAY: 'Martes',
	WEDNESDAY: 'Miércoles',
	THURSDAY: 'Jueves',
	FRIDAY: 'Viernes',
	SATURDAY: 'Sábado',
	SUNDAY: 'Domingo',
};

export default function availabilitiesForm() {
	const { control } = useFormContext<ProfileType>();

	const { fields } = useFieldArray({
		control,
		name: 'availabilities',
	});

	return (
		<div>
			<h2 className="text-2xl font-bold mb-4">Horario de Disponibilidad</h2>

			<table className="table-auto border w-full">
				<thead>
					<tr className="bg-gray-200">
						<th className="p-2">Día</th>
						<th className="p-2">De</th>
						<th className="p-2">Hasta</th>
						<th className="p-2">De</th>
						<th className="p-2">Hasta</th>
						<th className="p-2">De</th>
						<th className="p-2">Hasta</th>
					</tr>
				</thead>
				<tbody>
					{fields.map((item, index) => (
						<tr key={item.id} className="text-center">
							<td className="p-2 font-medium">{daysOfWeek[item.dayOfWeek]}</td>
							<td className="px-2">
								<FormField name={`availabilities.${index}.startTime1`} label="" type="time" />
							</td>
							<td className="px-2">
								<FormField name={`availabilities.${index}.endTime1`} label="" type="time" />
							</td>
							<td className="px-2">
								<FormField name={`availabilities.${index}.startTime2`} label="" type="time" />
							</td>
							<td className="px-2">
								<FormField name={`availabilities.${index}.endTime2`} label="" type="time" />
							</td>
							<td className="px-2">
								<FormField name={`availabilities.${index}.startTime3`} label="" type="time" />
							</td>
							<td className="px-2">
								<FormField name={`availabilities.${index}.endTime3`} label="" type="time" />
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
