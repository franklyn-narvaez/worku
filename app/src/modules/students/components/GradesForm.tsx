import { Trash2 } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import PdfInputField from '@/components/PdfInput';
import { Button } from '@/components/ui/button';

export default function GradesForm() {
	const {
		watch,
		setValue,
	} = useFormContext();

	const gradesValue = watch('grades');

	const handleDeleteGrades = () => {
		setValue('grades', undefined);
	};

	const hasFile = gradesValue && (
		typeof gradesValue === 'string' ||
		gradesValue instanceof File ||
		(gradesValue instanceof FileList && gradesValue.length > 0)
	);

	return (
		<div className="space-y-6">
			<h2 className="text-xl font-semibold">Certificado de Notas</h2>

			<PdfInputField
				name="grades"
				label="Selecciona tu certificado de notas (PDF)"
				required={true}
			/>

			{hasFile && (
				<div className="flex justify-center w-full">
					<Button
						variant="outline"
						onClick={handleDeleteGrades}
						type="button"
					>
						<Trash2 size={22} />
						<span className="xl:block">Cambiar documento</span>
					</Button>
				</div>
			)}
		</div>
	);
}
