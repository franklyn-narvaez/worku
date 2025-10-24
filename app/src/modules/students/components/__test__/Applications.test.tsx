import { render, screen, waitFor } from "@testing-library/react";
import MyApplications from "../Applications";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";

vi.mock("@/hooks/useAuth", () => ({
    useAuth: () => ({
        createAuthFetchOptions: vi.fn().mockResolvedValue({ headers: {} }),
    }),
}));

const mockApplications = [
    {
        id: "app1",
        status: "UNDER_REVIEW",
        appliedAt: "2025-09-30T00:00:00Z",
        interviewDate: null,
        attendedInterview: null,
        offer: {
            id: "offer1",
            title: "Oferta Test 1",
            description: "Descripción Test 1",
            closeDate: "2025-10-10T00:00:00Z",
        },
    },
    {
        id: "app2",
        status: "APPROVED",
        appliedAt: "2025-09-25T00:00:00Z",
        interviewDate: "2025-10-05T15:00:00Z",
        attendedInterview: true,
        offer: {
            id: "offer2",
            title: "Oferta Test 2",
            description: "Descripción Test 2",
            closeDate: "2025-10-15T00:00:00Z",
        },
    },
];

global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => mockApplications,
});

describe("MyApplications", () => {
    it("renderiza la lista de aplicaciones correctamente", async () => {
        render(
            <BrowserRouter>
                <MyApplications />
            </BrowserRouter>
        );

        // Espera que las filas aparezcan
        await waitFor(() => {
            expect(screen.getByText("Oferta Test 1")).toBeInTheDocument();
            expect(screen.getByText("Oferta Test 2")).toBeInTheDocument();
        });

        // Verifica estados
        expect(screen.getByText("En revisión")).toBeInTheDocument();
        expect(screen.getByText("Aprobada")).toBeInTheDocument();

        // Verifica asistencia
        expect(screen.getByText("Asistió")).toBeInTheDocument();
        expect(screen.getAllByText("No definida").length).toBe(1);

        // Verifica descripción
        expect(screen.getByText("Descripción Test 1")).toBeInTheDocument();
        expect(screen.getByText("Descripción Test 2")).toBeInTheDocument();
    });
});
