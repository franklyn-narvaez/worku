import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EducationForm from "../EducationForm";
import { useForm, FormProvider } from "react-hook-form";

interface FormValues {
    educations: {
        level: string;
        degreeTitle: string;
        endYear: number;
        institution: string;
        city: string;
        semesters: number;
    }[];
}

const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const methods = useForm<FormValues>({
        defaultValues: { educations: [] },
    });
    return <FormProvider {...methods}>{children}</FormProvider>;
};

describe("EducationForm", () => {
    it("permite agregar un registro y mostrar campos condicionales", async () => {
        const user = userEvent.setup();
        render(
            <Wrapper>
                <EducationForm />
            </Wrapper>
        );

        const addButton = screen.getByText("+ Agregar Educación");
        await user.click(addButton);

        expect(await screen.findByPlaceholderText("Ingrese el título")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("2025")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Nombre de la institución")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Ciudad")).toBeInTheDocument();

        const levelSelect = screen.getByLabelText("Nivel educativo");
        await user.selectOptions(levelSelect, "UNIVERSITY");

        expect(await screen.findByPlaceholderText("Número de semestres")).toBeInTheDocument();

        const deleteButton = screen.getByText("Eliminar");
        expect(deleteButton).toBeInTheDocument();

        await user.click(deleteButton);
        expect(screen.queryByPlaceholderText("Ingrese el título")).not.toBeInTheDocument();
    });
});
