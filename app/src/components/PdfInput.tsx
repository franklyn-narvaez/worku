import { FileText, Upload, X } from 'lucide-react';
import type React from 'react';
import { useMemo } from 'react';
import { type RegisterOptions, useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';

interface PdfInputProps {
	name: string;
	label: string;
	required?: boolean;
	className?: string;
	rules?: RegisterOptions;
}

export const PdfInputField: React.FC<PdfInputProps> = ({ name, className, rules }) => {
	const {
		register,
		watch,
		formState: { errors },
	} = useFormContext();

	const watchedValue = watch(name);
	const error = errors[name]?.message as string;

	const getFile = useMemo(() => {
		if (!watchedValue) return null;

		if (watchedValue instanceof FileList) {
			return watchedValue.length > 0 ? watchedValue[0] : null;
		}

		if (watchedValue instanceof File) {
			return watchedValue;
		}

		return null;
	}, [watchedValue]);

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
	};

	const renderContent = () => {
    // Si hay un PDF existente (string URL)
    if (typeof watchedValue === 'string' && watchedValue) {
        // Extraer nombre del archivo de la URL
        const fileName = watchedValue.split('/').pop() || 'documento-actual.pdf';

        return (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-green-600" />
                    <div>
                        <p className="text-sm font-medium text-gray-900">{fileName}</p>
                        <p className="text-xs text-green-600">Archivo actual</p>
                    </div>
                </div>
            </div>
        );
    }

    // Si hay un archivo seleccionado nuevo
    if (getFile) {
        return (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-red-600" />
                    <div>
                        <p className="text-sm font-medium text-gray-900">{getFile.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(getFile.size)}</p>
                    </div>
                </div>

            </div>
        );
    }

    return (
        <div className="text-center py-8">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Selecciona un archivo PDF</p>
            <p className="text-sm text-gray-500">Tamaño máximo: 2MB</p>
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
						setValueAs: value => {
							if (value instanceof FileList) {
								return value.length > 0 ? value[0] : undefined;
							}
							return value;
						},
					})}
					id={name}
					type="file"
					accept="application/pdf"
					className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
					aria-errormessage={error}
				/>
				{renderContent()}
			</label>
			{error && <p className="text-red-500 text-sm">{error}</p>}
		</div>
	);
};

export default PdfInputField;
