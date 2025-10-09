// components/FileInput.tsx
import type React from 'react';
import { useMemo } from 'react';
import { type RegisterOptions, useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';

interface FileInputProps {
	name: string;
	label: string;
	accept?: string;
	required?: boolean;
	preview?: boolean;
	multiple?: boolean;
	className?: string;
	rules?: RegisterOptions;
}

export const FileInputField: React.FC<FileInputProps> = ({
	name,
	label,
	accept,
	required = true,
	preview,
	multiple,
	className,
	rules,
}) => {
	const {
		register,
		watch,
		formState: { errors },
	} = useFormContext();

	const watchedValue = watch(name);
	const error = errors[name]?.message as string;

	const getFiles = useMemo(() => {
		if (!watchedValue) return [];

		if (watchedValue instanceof FileList) {
			return Array.from(watchedValue);
		}

		if (Array.isArray(watchedValue)) {
			return watchedValue;
		}

		if (watchedValue instanceof File) {
			return [watchedValue];
		}

		return [];
	}, [watchedValue]);

	const renderContent = () => {
		if (typeof watchedValue === 'string' && watchedValue) {
			return (
				<figure className="flex flex-col items-center justify-center w-full h-full">
					<div className="w-full h-64 flex items-center justify-center overflow-hidden">
						<img src={watchedValue} alt="Imagen actual" className="object-contain max-w-full max-h-full" />
					</div>
					<figcaption className="text-sm text-gray-500 my-2">Imagen actual</figcaption>
				</figure>
			);
		}

		if (getFiles.length > 0) {
			if (preview && !multiple) {
				const file = getFiles[0];
				return (
					<figure className="flex flex-col items-center justify-center w-full h-full">
						<div className="w-full h-64 flex items-center justify-center overflow-hidden">
							<img src={URL.createObjectURL(file)} alt="Preview" className="object-contain max-w-full max-h-full" />
						</div>
						<figcaption className="text-sm text-gray-500 my-2">{file.name}</figcaption>
					</figure>
				);
			}

			return (
				<div className="text-center">
					<p>
						Archivo{multiple ? 's' : ''} seleccionado{multiple ? 's' : ''}:
					</p>
					<p className="text-sm text-gray-600 mt-1">{getFiles.map(file => file.name).join(', ')}</p>
				</div>
			);
		}

		return (
			<div className="text-center">
				<p>Arrastra y suelta aquí o selecciona {!multiple && 'un'} archivo</p>
				<p className="text-sm text-gray-500 mt-1">Formatos: JPEG, PNG, WebP (max 1MB)</p>
			</div>
		);
	};

	return (
		<div className="space-y-2">
			<label
				className={cn(
					'relative border-dashed border-[3px] border-slate-200 text-gray-500 cursor-pointer w-full min-h-64 p-4 rounded-md text-center flex flex-col justify-center items-center hover:border-slate-400 focus-within:border-sky-600/50 transition-colors',
					error ? 'border-red-600' : '',
					className,
				)}
				htmlFor={name}
			>
				<Input
					{...register(name, {
						...rules,
					})}
					id={name}
					type="file"
					title={label}
					className="absolute h-full w-full opacity-0 cursor-pointer"
					accept={accept}
					multiple={multiple}
					aria-errormessage={error}
				/>
				{renderContent()}
			</label>
			{error && <p className="text-red-500 text-sm p-2 rounded">{error}</p>}
		</div>
	);
};

export default FileInputField;
