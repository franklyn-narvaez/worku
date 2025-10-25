import { render, screen, within } from "@testing-library/react";
import { ViewApplicants } from "../ViewApplicants";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";

vi.mock("@/hooks/useAuth", () => ({
    useAuth: () => ({
        createAuthFetchOptions: vi.fn().mockResolvedValue({ headers: {} }),
    }),
}));

global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
        offer: { id: "1", title: "Oferta Test" },
        applicants: [
            {
                applicationId: "app1",
                status: "UNDER_REVIEW",
                appliedAt: "2025-09-30T00:00:00Z",
                interviewDate: null,
                user: {
                    id: "user1",
                    name: "Juan",
                    lastName: "Pérez",
                    email: "juan@example.com",
                    college: {
                        name: "Escuela Test",
                        faculty: { name: "Facultad Test", id: "f1" },
                    },
                },
            },
            {
                applicationId: "app2",
                status: "CALLED_FOR_INTERVIEW",
                appliedAt: "2025-09-25T00:00:00Z",
                interviewDate: "2025-10-05T15:00:00Z",
                user: {
                    id: "user2",
                    name: "Ana",
                    lastName: "Gómez",
                    email: "ana@example.com",
                    college: null,
                },
            },
        ],
    }),
});

describe("ViewApplicants", () => {
    it("renderiza aplicantes correctamente", async () => {
        render(
            <BrowserRouter>
                <ViewApplicants />
            </BrowserRouter>
        );

        const firstApplicantCard = await screen.findByText(/Juan Pérez/).then((el) =>
            el.closest("div.border") as HTMLElement | null
        );
        expect(firstApplicantCard).toBeInTheDocument();

        expect(within(firstApplicantCard!).getByText(/Juan Pérez/)).toBeInTheDocument();
        expect(within(firstApplicantCard!).getByText(/✉️ juan@example.com/)).toBeInTheDocument();
        expect(within(firstApplicantCard!).getByText(/Facultad Test - Escuela Test/)).toBeInTheDocument();
        expect(within(firstApplicantCard!).getByText(/En revisión/)).toBeInTheDocument();

        const secondApplicantCard = await screen.findByText(/Ana Gómez/).then((el) =>
            el.closest("div.border") as HTMLElement | null
        );
        expect(secondApplicantCard).toBeInTheDocument();

        expect(within(secondApplicantCard!).getByText(/Ana Gómez/)).toBeInTheDocument();
        expect(within(secondApplicantCard!).getByText(/✉️ ana@example.com/)).toBeInTheDocument();
        expect(within(secondApplicantCard!).getByText(/Citado a entrevista/)).toBeInTheDocument();
    });
});
