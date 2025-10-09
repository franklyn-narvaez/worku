import { Trash2 } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import FileInputField from '@/components/FileInput';
import { Button } from '@/components/ui/button';

export default function PhotoForm() {
	const {
		formState: { errors },
		watch,
		setValue,
	} = useFormContext();

	const photoValue = watch('photo');

	const handleDeletePhoto = () => {
		setValue('photo', undefined);
	};

	return (
		<div className="space-y-4">
			<h2 className="text-xl font-semibold">Foto de Perfil</h2>

			<FileInputField
				name="photo"
				label="Selecciona una imagen"
				accept="image/jpeg, image/png, image/webp"
				preview
				required={true}
			/>
			<div className="flex justify-center w-full">
				<Button disabled={!photoValue} variant="destructive" onClick={handleDeletePhoto} type="button">
					<Trash2 size={22} />
					<span className="xl:block">Eliminar foto</span>
				</Button>
			</div>
		</div>
	);
}
