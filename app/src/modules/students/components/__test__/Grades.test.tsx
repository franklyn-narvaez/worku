// src/modules/student/components/__test__/GradesForm.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GradesForm from "../GradesForm";
import { useForm, FormProvider } from "react-hook-form";

// Helper para renderizar con react-hook-form
const renderWithForm = (defaultValues?: any) => {
    const Wrapper = ({ children }: { children: React.ReactNode }) => {
        const methods = useForm({ defaultValues });
        return <FormProvider {...methods}>{children}</FormProvider>;
    };
    return render(<Wrapper><GradesForm /></Wrapper>);
};

describe("GradesForm", () => {
    it("renderiza correctamente el título y el input PDF", () => {
        renderWithForm();
        expect(screen.getByText("Certificado de Notas")).toBeInTheDocument();
        expect(screen.getByText(/Selecciona un archivo PDF/i)).toBeInTheDocument();

    });

    it("no muestra el botón 'Cambiar documento' si no hay archivo", () => {
        renderWithForm({ grades: undefined });
        expect(screen.queryByText(/Cambiar documento/i)).not.toBeInTheDocument();
    });

    it("muestra el botón 'Cambiar documento' si hay un archivo", async () => {
        const file = new File(["dummy content"], "notas.pdf", { type: "application/pdf" });
        renderWithForm({ grades: file });
        expect(screen.getByText(/Cambiar documento/i)).toBeInTheDocument();
    });

    it("al hacer click en 'Cambiar documento' borra el valor de grades", async () => {
        const user = userEvent.setup();
        const file = new File(["dummy content"], "notas.pdf", { type: "application/pdf" });

        const Wrapper = ({ children }: { children: React.ReactNode }) => {
            const methods = useForm({ defaultValues: { grades: file } });
            return <FormProvider {...methods}>{children}</FormProvider>;
        };

        render(
            <Wrapper>
                <GradesForm />
            </Wrapper>
        );

        const button = screen.getByText(/Cambiar documento/i);
        await user.click(button);

        expect(screen.queryByText(/Cambiar documento/i)).not.toBeInTheDocument();
    });
});
