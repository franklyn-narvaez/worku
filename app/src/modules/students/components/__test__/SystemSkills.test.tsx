import { render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import userEvent from "@testing-library/user-event";
import { SystemSkillsForm } from "../SystemSkillsForm";

const Wrapper = () => {
    const methods = useForm({
        defaultValues: {
            systems: [],
        },
    });
    return (
        <FormProvider {...methods}>
            <SystemSkillsForm />
        </FormProvider>
    );
};

describe("SystemSkillsForm", () => {
    it("renderiza correctamente el título y el input", () => {
        render(<Wrapper />);

        expect(
            screen.getByText("Conocimientos en Sistemas")
        ).toBeInTheDocument();

        expect(
            screen.getByPlaceholderText("Escribe un programa y presiona Enter")
        ).toBeInTheDocument();

        expect(
            screen.getByText("No has agregado ningún programa todavía.")
        ).toBeInTheDocument();
    });

    it("agrega una habilidad al presionar Enter", async () => {
        const user = userEvent.setup();
        render(<Wrapper />);

        const input = screen.getByPlaceholderText(
            "Escribe un programa y presiona Enter"
        );

        await user.type(input, "Excel{enter}");

        expect(await screen.findByText("Excel")).toBeInTheDocument();
        expect(
            screen.queryByText("No has agregado ningún programa todavía.")
        ).not.toBeInTheDocument();
    });

    it("muestra un mensaje de error si el campo está vacío al presionar Enter", async () => {
        const user = userEvent.setup();
        render(<Wrapper />);

        const input = screen.getByPlaceholderText(
            "Escribe un programa y presiona Enter"
        );

        await user.type(input, "{enter}");

        expect(
            await screen.findByText("El nombre del programa no puede estar vacío.")
        ).toBeInTheDocument();
    });

    it("no permite agregar duplicados", async () => {
        const user = userEvent.setup();
        render(<Wrapper />);

        const input = screen.getByPlaceholderText(
            "Escribe un programa y presiona Enter"
        );

        await user.type(input, "Word{enter}");
        expect(await screen.findByText("Word")).toBeInTheDocument();

        await user.type(input, "Word{enter}");

        expect(
            await screen.findByText('"Word" ya ha sido agregado.')
        ).toBeInTheDocument();
    });

    it("elimina una habilidad al hacer click en ✕", async () => {
        const user = userEvent.setup();
        render(<Wrapper />);

        const input = screen.getByPlaceholderText(
            "Escribe un programa y presiona Enter"
        );

        await user.type(input, "PowerPoint{enter}");
        expect(await screen.findByText("PowerPoint")).toBeInTheDocument();

        const deleteButton = screen.getByRole("button", { name: "✕" });
        await user.click(deleteButton);

        expect(
            screen.getByText("No has agregado ningún programa todavía.")
        ).toBeInTheDocument();
    });

    it("limpia el mensaje de error al escribir una nueva entrada válida", async () => {
        const user = userEvent.setup();
        render(<Wrapper />);

        const input = screen.getByPlaceholderText(
            "Escribe un programa y presiona Enter"
        );

        await user.type(input, "{enter}");
        expect(
            await screen.findByText("El nombre del programa no puede estar vacío.")
        ).toBeInTheDocument();

        await user.clear(input);
        await user.type(input, "Photoshop");

        expect(
            screen.queryByText("El nombre del programa no puede estar vacío.")
        ).not.toBeInTheDocument();
    });
});
