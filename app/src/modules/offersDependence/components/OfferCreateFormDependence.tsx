import { FormField } from '@/components/FormField';
import { useEffect, useState } from 'react';
import type { College, Faculty } from '@prisma/client';
import { FormProvider, useForm, useWatch, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { CREATE_OFFER_DEPENDENCE, DEPENDENCE_OFFERS, GET_COLLEGE, GET_FACULTY } from '@/constants/path';
import { CreateSchema, type CreateType } from '../schemas/Create';
import { TextAreaField } from '@/components/TextAreaField';
import { SelectField } from '@/components/SelectField';
import { DatePickerField } from '@/components/DatePicker';
import { useAuth } from '@/hooks/useAuth';

export default function OfferCreateFormDependence() {
  const { createAuthFetchOptions } = useAuth();
  const navigate = useNavigate();

  const methods = useForm<CreateType>({
    resolver: zodResolver(CreateSchema),
  });

  const { handleSubmit, formState: { isSubmitting, isValid }, control, setValue } = methods;

  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);

  // Observamos la facultad seleccionada
  const selectedFacultyId = useWatch({
    control,
    name: 'facultyId',
  });

  // Fetch de facultades al montar
  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const options = await createAuthFetchOptions();
        const res = await fetch(GET_FACULTY, options);
        const data = await res.json();
        setFaculties(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error al cargar facultades:", err);
        setFaculties([]);
      }
    };
    fetchFaculties();
  }, [createAuthFetchOptions]);

  // Fetch dinámico de colegios según facultad seleccionada
  useEffect(() => {
    if (!selectedFacultyId) {
      setColleges([]);
      setValue('collegeId', ''); // reset select
      return;
    }

    const fetchCollegesByFaculty = async () => {
      try {
        const options = await createAuthFetchOptions();
        const res = await fetch(`${GET_COLLEGE}?facultyId=${selectedFacultyId}`, options);
        const data = await res.json();
        setColleges(Array.isArray(data) ? data : []);
        setValue('collegeId', ''); // resetear select al cambiar facultad
      } catch (err) {
        console.error("Error al cargar colegios:", err);
        setColleges([]);
      }
    };

    fetchCollegesByFaculty();
  }, [selectedFacultyId, createAuthFetchOptions, setValue]);

  const handleNavigate = () => navigate(DEPENDENCE_OFFERS);

  const onSubmit: SubmitHandler<CreateType> = async data => {
    const authOptions = await createAuthFetchOptions();
    const fetchOptions = {
      ...authOptions,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authOptions.headers || {}),
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(CREATE_OFFER_DEPENDENCE, fetchOptions);

    if (response.ok) {
      navigate(DEPENDENCE_OFFERS);
    } else {
      const errorData = await response.json();
      console.error('Error creating offer:', errorData);
    }
  };

  return (
    <div className="h-full flex items-center justify-center">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white/95 p-10 rounded-2xl shadow-2xl w-full max-w-4xl flex-col items-center">
          <h1 className="text-text-title font-bold text-4xl mb-4">Crear Oferta</h1>

          <FormField name="title" label="Titulo" type="text" placeholder="Ingrese el titulo" />
          <TextAreaField name="description" label="Descripción" placeholder="Ingrese la descripción" rows={3} />
          <TextAreaField name="requirements" label="Requisitos" placeholder="Ingrese los requisitos" rows={3} />

          <SelectField
            name="facultyId"
            label="Facultad"
            options={faculties.map(f => ({ value: f.id, label: f.name }))}
            placeholder="Selecciona una facultad"
          />

          <SelectField
            name="collegeId"
            label="Escuela"
            options={colleges.map(c => ({ value: c.id, label: c.name }))}
            placeholder="Selecciona una escuela"
          />

          <DatePickerField
            name="closeDate"
            label="Fecha de cierre"
            rules={{ required: 'La fecha de cierre es obligatoria' }}
          />

          <div className="flex justify-between gap-x-2 mt-4">
            <button
              type="button"
              className="w-1/2 bg-slate-300 text-black p-3 rounded-lg hover:bg-slate-400 transition"
              onClick={handleNavigate}
            >
              Cancelar
            </button>
            <button type="submit" className="w-1/2 button-create p-3 rounded-lg" disabled={isSubmitting && !isValid}>
              Crear oferta
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
