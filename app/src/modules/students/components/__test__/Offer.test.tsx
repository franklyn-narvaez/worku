import { render, screen, within } from "@testing-library/react";
import { FormOffer } from "../FormOffer";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";

vi.mock("@/hooks/useAuth", () => ({
    useAuth: () => ({
        createAuthFetchOptions: vi.fn().mockResolvedValue({ headers: {} }),
    }),
}));

global.fetch = vi.fn();

const mockOffer = {
    id: "offer1",
    title: "Oferta Test",
    description: "Descripción de prueba",
    requirements: "Requisitos de prueba",
    status: true,
    createdAt: new Date("2025-10-01T00:00:00Z"),
    closeDate: new Date("2025-10-31T00:00:00Z"),
    updatedAt: new Date("2025-10-02T00:00:00Z"),
    collegeId: "c1",
    facultyId: "f1",
    college: { id: "c1", name: "Escuela Test" },
    faculty: { id: "f1", name: "Facultad Test" },
    userApplicationStatus: null,
    interviewDate: null,
    attendedInterview: null,
};

describe("FormOffer", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renderiza la información de la oferta correctamente", () => {
        render(
            <BrowserRouter>
                <FormOffer offer={mockOffer} />
            </BrowserRouter>
        );

        expect(screen.getByText(/Oferta Test/i)).toBeInTheDocument();
        expect(screen.getByText(/Descripción de prueba/i)).toBeInTheDocument();
        expect(screen.getByText(/Requisitos:/i)).toBeInTheDocument();
        expect(screen.getByText(/Requisitos de prueba/i)).toBeInTheDocument();

        const collegeFacultySection = screen.getByText(/Escuela:/i).closest("div");
        expect(collegeFacultySection).toBeInTheDocument();
        expect(within(collegeFacultySection!).getByText(/Escuela Test/i)).toBeInTheDocument();
        expect(within(collegeFacultySection!).getByText(/Facultad Test/i)).toBeInTheDocument();

        expect(screen.getByText(/Activa/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Aplicar a la oferta/i })).toBeEnabled();
    });
});
