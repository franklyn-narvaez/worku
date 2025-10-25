import { render, screen, waitFor, within } from "@testing-library/react";
import ViewOfferDetails from "../ViewOfferDetails";
import { MemoryRouter } from "react-router-dom";
import { toast } from "react-toastify";

vi.mock("@/hooks/useAuth", () => ({
    useAuth: () => ({
        createAuthFetchOptions: vi.fn().mockResolvedValue({ headers: { Authorization: "Bearer token" } }),
    }),
}));

vi.mock("react-toastify", () => ({
    toast: {
        error: vi.fn(),
    },
}));

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
    return {
        ...actual,
        useParams: () => ({ id: "123" }),
        useNavigate: () => vi.fn(),
    };
});

describe("ViewOfferDetails", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("muestra el estado de carga inicialmente", () => {
        global.fetch = vi.fn(() => new Promise(() => { })) as any;

        render(
            <MemoryRouter>
                <ViewOfferDetails />
            </MemoryRouter>
        );

        expect(screen.getByText("Cargando información...")).toBeInTheDocument();
    });

    it("muestra mensaje de error si fetch lanza excepción", async () => {
        global.fetch = vi.fn().mockRejectedValue(new Error("Falla de conexión"));

        render(
            <MemoryRouter>
                <ViewOfferDetails />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Error de conexión con el servidor");
        });
    });

    it("renderiza correctamente la oferta y aplicantes", async () => {
        const mockOffer = {
            id: "123",
            title: "Oferta de prueba",
            status: true,
            description: "Descripción de prueba",
            requirements: "Requisitos de prueba",
            createdAt: "2025-10-01T00:00:00.000Z",
            updatedAt: "2025-10-05T00:00:00.000Z",
            closeDate: "2025-10-31T00:00:00.000Z",
            college: { id: "c1", name: "Escuela de Ingeniería", faculty: { id: "f1", name: "Facultad de Ingeniería" } },
            _count: { Application: 1 },
            Application: [
                {
                    id: "a1",
                    status: "UNDER_REVIEW",
                    user: {
                        id: "u1",
                        name: "Juan",
                        lastName: "Pérez",
                        email: "juan@example.com",
                        StudentProfile: { studentCode: "20201234", planName: "Ingeniería de Sistemas", semester: 8 },
                    },
                },
            ],
        };

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue(mockOffer),
        });

        render(
            <MemoryRouter>
                <ViewOfferDetails />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("Oferta de prueba")).toBeInTheDocument();
        });

        expect(screen.getByText(/Descripción:/i).nextSibling).toHaveTextContent("Descripción de prueba");
        expect(screen.getByText(/Requisitos:/i).nextSibling).toHaveTextContent("Requisitos de prueba");
        expect(screen.getByText("Facultad de Ingeniería - Escuela de Ingeniería")).toBeInTheDocument();

        const applicantCard = screen.getByText(/Juan Pérez/).closest("div");
        expect(within(applicantCard!).getByText(/👤 Juan Pérez/)).toBeInTheDocument();
        expect(within(applicantCard!).getByText(/🎓 Programa Ingeniería de Sistemas/)).toBeInTheDocument();
        expect(within(applicantCard!).getByText(/📚 Semestre 8/)).toBeInTheDocument();
        expect(within(applicantCard!).getByText(/✉️ juan@example.com/)).toBeInTheDocument();
        expect(within(applicantCard!).getByText(/En revisión/)).toBeInTheDocument();
    });
});
