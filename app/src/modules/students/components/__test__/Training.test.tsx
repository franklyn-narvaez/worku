import { render, screen, fireEvent } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import TrainingForm from "../TrainingForm";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const methods = useForm({
        defaultValues: {
            trainings: [],
        },
    });
    return <FormProvider {...methods}>{children}</FormProvider>;
};

describe("TrainingForm", () => {
    it("renderiza el título del formulario", () => {
        render(
            <Wrapper>
                <TrainingForm />
            </Wrapper>
        );

        expect(screen.getByText("Capacitaciones")).toBeInTheDocument();
    });

    it("agrega una nueva capacitación al hacer click en '+ Agregar capacitación'", () => {
        render(
            <Wrapper>
                <TrainingForm />
            </Wrapper>
        );

        const addButton = screen.getByRole("button", { name: /\+ Agregar capacitación/i });
        fireEvent.click(addButton);

        expect(screen.getByPlaceholderText("Nombre de la institución")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Ej: Curso de React")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Ej: 40 horas")).toBeInTheDocument();
    });

    it("elimina una capacitación al hacer click en 'Eliminar'", () => {
        render(
            <Wrapper>
                <TrainingForm />
            </Wrapper>
        );

        const addButton = screen.getByRole("button", { name: /\+ Agregar capacitación/i });
        fireEvent.click(addButton);

        const deleteButton = screen.getByRole("button", { name: /Eliminar/i });
        fireEvent.click(deleteButton);

        expect(screen.queryByPlaceholderText("Nombre de la institución")).not.toBeInTheDocument();
    });

    it("muestra varios formularios si se agregan múltiples capacitaciones", () => {
        render(
            <Wrapper>
                <TrainingForm />
            </Wrapper>
        );

        const addButton = screen.getByRole("button", { name: /\+ Agregar capacitación/i });
        fireEvent.click(addButton);
        fireEvent.click(addButton);

        const institutionFields = screen.getAllByPlaceholderText("Nombre de la institución");
        expect(institutionFields.length).toBe(2);
    });

    it("no lanza errores si se eliminan todos los elementos", () => {
        render(
            <Wrapper>
                <TrainingForm />
            </Wrapper>
        );

        const addButton = screen.getByRole("button", { name: /\+ Agregar capacitación/i });
        fireEvent.click(addButton);

        const deleteButton = screen.getByRole("button", { name: /Eliminar/i });
        fireEvent.click(deleteButton);

        expect(screen.queryByPlaceholderText("Nombre de la institución")).not.toBeInTheDocument();
    });
});
