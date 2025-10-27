import { render, screen } from "@testing-library/react";
import AvailabilityForm from "../AvailabilityForm";
import { vi } from "vitest";

vi.mock("react-hook-form", () => ({
    useFormContext: vi.fn(() => ({
        control: {},
    })),
    useFieldArray: vi.fn(() => ({
        fields: [
            { id: "1", dayOfWeek: "MONDAY" },
            { id: "2", dayOfWeek: "WEDNESDAY" },
            { id: "3", dayOfWeek: "FRIDAY" },
        ],
    })),
}));

vi.mock("@/components/FormField", () => ({
    FormField: ({ name }: { name: string }) => <input data-testid={name} />,
}));

describe("AvailabilityForm", () => {
    it("renderiza título y filas de disponibilidad correctamente", () => {
        render(<AvailabilityForm />);

        expect(screen.getByText("Horario de Disponibilidad")).toBeInTheDocument();

        expect(screen.getByText("Lunes")).toBeInTheDocument();
        expect(screen.getByText("Miércoles")).toBeInTheDocument();
        expect(screen.getByText("Viernes")).toBeInTheDocument();

        const inputNames = [
            "availabilities.0.startTime1",
            "availabilities.0.endTime1",
            "availabilities.0.startTime2",
            "availabilities.0.endTime2",
            "availabilities.0.startTime3",
            "availabilities.0.endTime3",
        ];

        inputNames.forEach((name) => {
            expect(screen.getByTestId(name)).toBeInTheDocument();
        });
    });
});
