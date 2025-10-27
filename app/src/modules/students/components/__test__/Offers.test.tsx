import { render, screen, waitFor } from "@testing-library/react";
import ListOffers from "../ListOffers";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";

vi.mock("@/hooks/useAuth", () => ({
    useAuth: () => ({
        createAuthFetchOptions: vi.fn().mockResolvedValue({ headers: {} }),
    }),
}));

const mockOffers = [
    {
        id: "offer1",
        title: "Oferta 1",
        description: "Descripción 1",
        requirements: "Requisitos 1",
        status: true,
        createdAt: new Date(),
        closeDate: new Date(),
        updatedAt: new Date(),
        college: { id: "c1", name: "Escuela 1" },
        faculty: { id: "f1", name: "Facultad 1" },
        userApplicationStatus: null,
        interviewDate: null,
        attendedInterview: null,
    },
    {
        id: "offer2",
        title: "Oferta 2",
        description: "Descripción 2",
        requirements: "Requisitos 2",
        status: true,
        createdAt: new Date(),
        closeDate: new Date(),
        updatedAt: new Date(),
        college: { id: "c2", name: "Escuela 2" },
        faculty: { id: "f2", name: "Facultad 2" },
        userApplicationStatus: null,
        interviewDate: null,
        attendedInterview: null,
    },
];

global.fetch = vi.fn();

describe("ListOffers", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renderiza correctamente todas las ofertas", async () => {
        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => mockOffers,
        });

        render(
            <BrowserRouter>
                <ListOffers />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("Oferta 1")).toBeInTheDocument();
            expect(screen.getByText("Oferta 2")).toBeInTheDocument();

            expect(screen.getByText("Escuela 1")).toBeInTheDocument();
            expect(screen.getByText("Facultad 2")).toBeInTheDocument();
            expect(screen.getAllByRole("button", { name: /Aplicar a la oferta/i }).length).toBe(2);
        });
    });

    it("maneja fetch fallido correctamente", async () => {
        (global.fetch as any).mockRejectedValueOnce(new Error("Fetch fallido"));

        render(
            <BrowserRouter>
                <ListOffers />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("Ofertas")).toBeInTheDocument();
            expect(screen.getByText("No hay ofertas disponibles")).toBeInTheDocument();
            expect(screen.queryByText("Oferta 1")).not.toBeInTheDocument();
        });
    });
});
