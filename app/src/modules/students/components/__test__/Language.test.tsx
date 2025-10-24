import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LanguageForm from "../LanguageForm";
import { useForm, FormProvider } from "react-hook-form";

const renderWithForm = (defaultValues?: any) => {
    const Wrapper = ({ children }: { children: React.ReactNode }) => {
        const methods = useForm({ defaultValues });
        return <FormProvider {...methods}>{children}</FormProvider>;
    };
    return render(<Wrapper><LanguageForm /></Wrapper>);
};

describe("LanguageForm", () => {
    it("renderiza correctamente el título y el botón de agregar idioma", () => {
        renderWithForm();

        expect(screen.getByText("Idiomas")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /\+ Agregar idioma/i })).toBeInTheDocument();
    });

    it("permite agregar un idioma", async () => {
        const user = userEvent.setup();
        renderWithForm();

        const addButton = screen.getByRole("button", { name: /\+ Agregar idioma/i });
        await user.click(addButton);

        expect(screen.getByPlaceholderText("Ej: Inglés, Francés")).toBeInTheDocument();

        expect(screen.getByLabelText("Conversación")).toBeInTheDocument();
        expect(screen.getByLabelText("Escritura")).toBeInTheDocument();
        expect(screen.getByLabelText("Lectura")).toBeInTheDocument();
    });


    it("permite eliminar un idioma agregado", async () => {
        const user = userEvent.setup();
        renderWithForm();

        const addButton = screen.getByRole("button", { name: /\+ Agregar idioma/i });
        await user.click(addButton);

        const removeButton = screen.getByRole("button", { name: /Eliminar/i });
        expect(removeButton).toBeInTheDocument();

        await user.click(removeButton);

        expect(screen.queryByPlaceholderText("Ej: Inglés, Francés")).not.toBeInTheDocument();
        expect(screen.queryByPlaceholderText("Seleccione un nivel")).not.toBeInTheDocument();
    });
});
