// src/modules/student/components/BasicInfo.tsx
import { FormField } from "@/components/FormField";
import { SelectField } from "@/components/SelectField";
import { DatePickerField } from "@/components/DatePicker";
import { TextAreaField } from "@/components/TextAreaField";

export default function BasicForm() {
    return (
        <div>
            <h1 className="text-text-title font-bold text-3xl mb-6">Datos Básicos</h1>

            {/* Código y Nombres */}
            <div className="grid grid-cols-4 gap-4">
                <FormField
                    name="studentCode"
                    label="Código Estudiante"
                    type="text"
                    placeholder="Ingrese el código"
                />

                <FormField
                    name="lastName"
                    label="Primer Apellido"
                    type="text"
                    placeholder="Ingrese el primer apellido"
                />

                <FormField
                    name="secondLastName"
                    label="Segundo Apellido"
                    type="text"
                    placeholder="Ingrese el segundo apellido"
                />

                <FormField
                    name="fullName"
                    label="Nombre Completo"
                    type="text"
                    placeholder="Ingrese su nombre completo"
                />
            </div>

            {/* Datos académicos */}
            <div className="grid grid-cols-4 gap-4 mt-4">
                <FormField
                    name="planCode"
                    label="Código del plan"
                    type="text"
                    placeholder="Ingrese el código"
                />

                <FormField
                    name="planName"
                    label="Nombre del plan"
                    type="text"
                    placeholder="Ingrese el nombre del plan"
                />

                <FormField
                    name="semester"
                    label="Semestre"
                    type="number"
                    placeholder="Ingrese el semestre"
                />

                <FormField
                    name="campus"
                    label="Sede"
                    type="text"
                    placeholder="Ingrese la sede"
                />

                <FormField
                    name="jornada"
                    label="Jornada"
                    type="text"
                    placeholder="Ingrese la jornada"
                />

                <FormField
                    name="academicPeriod"
                    label="Periodo Académico"
                    type="text"
                    placeholder="Ingrese el periodo académico"
                />
            </div>

            {/* Datos personales */}
            <div className="grid grid-cols-4 gap-4 mt-4">
                <SelectField
                    name="gender"
                    label="Género"
                    options={[
                        { value: "MASCULINO", label: "Masculino" },
                        { value: "FEMENINO", label: "Femenino" },
                    ]}
                    placeholder="Seleccione un género"
                />

                <DatePickerField
                    name="birthDate"
                    label="Fecha de Nacimiento"
                    rules={{ required: "La fecha de nacimiento es obligatoria" }}
                />

                <FormField
                    name="age"
                    label="Edad"
                    type="number"
                    placeholder="Ingrese su edad"
                />

                <FormField
                    name="birthPlace"
                    label="Lugar de Nacimiento"
                    type="text"
                    placeholder="Ciudad de nacimiento"
                />

                <FormField
                    name="idNumber"
                    label="Número de Documento"
                    type="text"
                    placeholder="Ingrese su documento"
                />

                <FormField
                    name="idIssuedPlace"
                    label="Lugar de Expedición"
                    type="text"
                    placeholder="Ciudad de expedición"
                />
            </div>

            {/* Estado civil y familia */}
            <div className="grid grid-cols-3 gap-4 mt-4">
                <SelectField
                    name="maritalStatus"
                    label="Estado Civil"
                    options={[
                        { value: "SINGLE", label: "Soltero(a)" },
                        { value: "MARRIED", label: "Casado(a)" },
                        { value: "FREE_UNION", label: "Unión libre" },
                        { value: "OTHER", label: "Otro" },
                    ]}
                    placeholder="Seleccione un estado civil"
                />

                <FormField
                    name="dependents"
                    label="Número de Dependientes"
                    type="number"
                    placeholder="Ingrese el número de dependientes"
                />

                <SelectField
                    name="familyPosition"
                    label="Posición Familiar"
                    options={[
                        { value: "INDEPENDENT", label: "Independiente" },
                        { value: "HEAD_OF_FAMILY", label: "Cabeza de familia" },
                        { value: "CHILD", label: "Hijo(a)" },
                        { value: "SPOUSE", label: "Cónyuge" },
                    ]}
                    placeholder="Seleccione una posición familiar"
                />
            </div>

            {/* Dirección */}
            <div className="grid grid-cols-5 gap-4 mt-4">
                <FormField
                    name="address"
                    label="Dirección actual residencia"
                    type="text"
                    placeholder="Ingrese su dirección"
                />
                <FormField
                    name="stratum"
                    label="Estrato"
                    type="text"
                    placeholder="Ingrese su estrato"
                />
                <FormField
                    name="neighborhood"
                    label="Barrio"
                    type="text"
                    placeholder="Ingrese su barrio"
                />
                <FormField
                    name="city"
                    label="Ciudad"
                    type="text"
                    placeholder="Ingrese su ciudad"
                />
                <FormField
                    name="department"
                    label="Departamento"
                    type="text"
                    placeholder="Ingrese su departamento"
                />
            </div>

            {/* Contacto */}
            <div className="grid grid-cols-5 gap-4 mt-4">
                <FormField
                    name="phone"
                    label="Teléfono"
                    type="text"
                    placeholder="Teléfono fijo"
                />
                <FormField
                    name="mobile"
                    label="Celular"
                    type="text"
                    placeholder="Celular"
                />
                <FormField
                    name="email"
                    label="Correo Electrónico"
                    type="email"
                    placeholder="Correo electrónico"
                />
                <FormField
                    name="emergencyContact"
                    label="Contacto de Emergencia"
                    type="text"
                    placeholder="Nombre de la persona"
                />
                <FormField
                    name="emergencyPhone"
                    label="Teléfono de Emergencia"
                    type="text"
                    placeholder="Teléfono"
                />
            </div >

            <div className="mt-4">
                <TextAreaField
                    name="occupationalProfile"
                    label="Perfil Ocupacional"
                    placeholder="Describa detalladamente qué sabe hacer, en qué áreas se desempeña bien, qué actividades podría realizar de acuerdo con su profesión, preparación, aptitudes e intereses."
                    rows={3}
                />
            </div>
        </div>
    );
}
