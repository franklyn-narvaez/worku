import { render, screen } from "@testing-library/react";
import BasicForm from "../BasicForm";
import { vi } from "vitest";

vi.mock("@/components/FormField", () => ({
    FormField: ({ name }: { name: string }) => <input data-testid={name} />,
}));

vi.mock("@/components/SelectField", () => ({
    SelectField: ({ name }: { name: string }) => <select data-testid={name} />,
}));

vi.mock("@/components/DatePicker", () => ({
    DatePickerField: ({ name }: { name: string }) => <input data-testid={name} />,
}));

vi.mock("@/components/TextAreaField", () => ({
    TextAreaField: ({ name }: { name: string }) => <textarea data-testid={name} />,
}));

describe("BasicForm", () => {
    it("renderiza correctamente todos los campos básicos", () => {
        render(<BasicForm />);

        expect(screen.getByText("Datos Básicos")).toBeInTheDocument();

        const fieldNames = [
            "studentCode",
            "lastName",
            "secondLastName",
            "fullName",
            "planCode",
            "planName",
            "semester",
            "campus",
            "jornada",
            "academicPeriod",
            "gender",
            "birthDate",
            "age",
            "birthPlace",
            "idNumber",
            "idIssuedPlace",
            "maritalStatus",
            "dependents",
            "familyPosition",
            "address",
            "stratum",
            "neighborhood",
            "city",
            "department",
            "phone",
            "mobile",
            "email",
            "emergencyContact",
            "emergencyPhone",
            "occupationalProfile",
        ];

        fieldNames.forEach((name) => {
            expect(screen.getByTestId(name)).toBeInTheDocument();
        });
    });
});
