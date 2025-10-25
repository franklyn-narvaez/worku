import { render, screen, fireEvent } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import WorkExperienceForm from "../WorkExperienceForm";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const methods = useForm({
        defaultValues: {
            workExperiences: [],
        },
    });
    return <FormProvider {...methods}>{children}</FormProvider>;
};

describe("WorkExperienceForm", () => {
    it("renderiza el título del formulario", () => {
        render(
            <Wrapper>
                <WorkExperienceForm />
            </Wrapper>
        );

        expect(screen.getByText("Experiencia Laboral")).toBeInTheDocument();
    });

    it("agrega una nueva experiencia al hacer click en '+ Agregar Experiencia'", () => {
        render(
            <Wrapper>
                <WorkExperienceForm />
            </Wrapper>
        );

        const addButton = screen.getByRole("button", { name: /\+ Agregar Experiencia/i });
        fireEvent.click(addButton);

        expect(screen.getByPlaceholderText("Ej: Google")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Ej: Desarrollador Full Stack")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Describe las responsabilidades principales")).toBeInTheDocument();
    });

    it("elimina una experiencia al hacer click en 'Eliminar Experiencia'", () => {
        render(
            <Wrapper>
                <WorkExperienceForm />
            </Wrapper>
        );

        const addButton = screen.getByRole("button", { name: /\+ Agregar Experiencia/i });
        fireEvent.click(addButton);

        const deleteButton = screen.getByRole("button", { name: /Eliminar Experiencia/i });
        fireEvent.click(deleteButton);

        expect(screen.queryByPlaceholderText("Ej: Google")).not.toBeInTheDocument();
    });

    it("muestra varios formularios si se agregan múltiples experiencias", () => {
        render(
            <Wrapper>
                <WorkExperienceForm />
            </Wrapper>
        );

        const addButton = screen.getByRole("button", { name: /\+ Agregar Experiencia/i });
        fireEvent.click(addButton);
        fireEvent.click(addButton);

        const companyInputs = screen.getAllByPlaceholderText("Ej: Google");
        expect(companyInputs.length).toBe(2);
    });

    it("no lanza errores si se eliminan todas las experiencias", () => {
        render(
            <Wrapper>
                <WorkExperienceForm />
            </Wrapper>
        );

        const addButton = screen.getByRole("button", { name: /\+ Agregar Experiencia/i });
        fireEvent.click(addButton);

        const deleteButton = screen.getByRole("button", { name: /Eliminar Experiencia/i });
        fireEvent.click(deleteButton);

        expect(screen.queryByPlaceholderText("Ej: Google")).not.toBeInTheDocument();
    });
});
