import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UpdateFormDependence from "../UpdateFormDependence";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import { UPDATE_OFFER_DEPENDENCE } from "@/constants/path";

vi.mock("@/hooks/useAuth", () => ({
    useAuth: () => ({
        createAuthFetchOptions: vi.fn().mockResolvedValue({
            headers: { Authorization: "Bearer mock-token" },
        }),
    }),
}));

describe("UpdateFormDependence", () => {
    const mockOffer = {
        id: "1",
        title: "Oferta anterior",
        description: "Descripción vieja",
        requirements: "Requisitos antiguos",
        collegeId: "1",
        facultyId: "1",
        closeDate: new Date("2025-12-30T00:00:00.000Z"),
        status: true,
        createdAt: new Date("2025-01-01T00:00:00.000Z"),
        updatedAt: new Date("2025-06-01T00:00:00.000Z"),
        college: { id: "1", name: "Ingeniería" },
        faculty: { id: "1", name: "Industrial" },
    };

    const mockCollege = [
        { id: "1", name: "Ingeniería", facultyId: "1" },
        { id: "2", name: "Ciencias Sociales", facultyId: "2" },
    ];

    const mockFaculty = [
        { id: "1", name: "Industrial", facultyId: "1" },
        { id: "2", name: "Sistemas", facultyId: "2" },
    ];

    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("permite actualizar la información correctamente", async () => {
        global.fetch = vi.fn().mockResolvedValueOnce({ ok: true });

        render(
            <MemoryRouter>
                <UpdateFormDependence offer={mockOffer} college={mockCollege} faculty={mockFaculty} />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText("Ingrese el titulo"), {
            target: { value: "Nueva oferta actualizada" },
        });
        fireEvent.change(screen.getByPlaceholderText("Ingrese la descripción"), {
            target: { value: "Descripción actualizada" },
        });
        fireEvent.change(screen.getByPlaceholderText("Ingrese los requisitos"), {
            target: { value: "Nuevos requisitos" },
        });

        fireEvent.change(screen.getByLabelText("Escuela"), {
            target: { value: "2" },
        });
        fireEvent.change(screen.getByLabelText("Facultad"), {
            target: { value: "2" },
        });

        fireEvent.change(screen.getByLabelText("Estado"), {
            target: { value: "false" },
        });

        const dateLabel = screen.getByText("Fecha de cierre");
        const dateButton = dateLabel.closest("div")?.querySelector("button");
        expect(dateButton).toBeTruthy();

        if (dateButton) fireEvent.click(dateButton);

        const submitButton = screen.getByRole("button", { name: /actualizar oferta/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);
        });

        const [url, options] = (global.fetch as any).mock.calls[0];
        expect(url).toBe(UPDATE_OFFER_DEPENDENCE);
        const body = JSON.parse(options.body);
        expect(body.title).toBe("Nueva oferta actualizada");
        expect(body.status).toBe(false);
    });
});
