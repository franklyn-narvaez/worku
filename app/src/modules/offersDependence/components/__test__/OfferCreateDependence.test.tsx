import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import { vi } from 'vitest';
import OfferCreateFormDependence from '../OfferCreateFormDependence';

// --- Mock de useNavigate ---
const navigateMock = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => navigateMock,
}));

// --- Mock de useAuth ---
const createAuthFetchOptionsMock = vi.fn().mockResolvedValue({
    headers: { Authorization: 'Bearer token' },
});
vi.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({
        createAuthFetchOptions: createAuthFetchOptionsMock,
    }),
}));

// --- Mock global de fetch ---
const mockFetch = vi.fn();
global.fetch = mockFetch as unknown as typeof fetch;

describe('OfferCreateFormDependence', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders form and loads select options correctly', async () => {
        // Simular llamadas para GET_COLLEGE y GET_FACULTY
        mockFetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [{ id: '1', name: 'Ingeniería' }],
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [{ id: '2', name: 'Facultad Ingeniería' }],
            });

        render(<OfferCreateFormDependence />);

        // Esperar a que carguen los select
        await waitFor(() => {
            expect(screen.getByText('Ingeniería')).toBeInTheDocument();
            expect(screen.getByText('Facultad Ingeniería')).toBeInTheDocument();
        });

        const collegeSelect = screen.getByLabelText('Escuela');
        expect(within(collegeSelect).getByText('Ingeniería')).toBeInTheDocument();

        const facultySelect = screen.getByLabelText('Facultad');
        expect(within(facultySelect).getByText('Facultad Ingeniería')).toBeInTheDocument();
    });

    it('submits form successfully and navigates on success', async () => {
        // Mock para carga de selects
        mockFetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [{ id: '1', name: 'Ingeniería' }],
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [{ id: '2', name: 'Facultad Ingeniería' }],
            })
            // Mock para POST CREATE_OFFER_DEPENDENCE
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({}),
            });

        render(<OfferCreateFormDependence />);

        // Esperar a que carguen los select
        await waitFor(() => screen.getByText('Ingeniería'));

        // Llenar campos del formulario
        fireEvent.change(screen.getByPlaceholderText('Ingrese el titulo'), {
            target: { value: 'Nueva oferta de prueba' },
        });
        fireEvent.change(screen.getByPlaceholderText('Ingrese la descripción'), {
            target: { value: 'Descripción simulada' },
        });
        fireEvent.change(screen.getByPlaceholderText('Ingrese los requisitos'), {
            target: { value: 'Requisitos simulados' },
        });

        // Seleccionar escuela y facultad
        fireEvent.change(screen.getByLabelText('Escuela'), { target: { value: '1' } });
        fireEvent.change(screen.getByLabelText('Facultad'), { target: { value: '2' } });

        // Simular fecha futura
        const closeDateInput = screen.getByLabelText('Fecha de cierre');
        const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
        fireEvent.change(closeDateInput, { target: { value: tomorrow } });

        // Enviar formulario
        const submitButton = screen.getByText('Crear oferta');
        fireEvent.click(submitButton);

        // Esperar respuesta
        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledTimes(3); // 2 GET + 1 POST
            const [url, options] = mockFetch.mock.calls[2];
            expect(url).toContain('/create'); // debe coincidir con CREATE_OFFER_DEPENDENCE
            expect(options.method).toBe('POST');
            expect(JSON.parse(options.body)).toMatchObject({
                title: 'Nueva oferta de prueba',
                description: 'Descripción simulada',
                requirements: 'Requisitos simulados',
                collegeId: '1',
                facultyId: '2',
            });
            expect(navigateMock).toHaveBeenCalledWith('/dependence/offers');
        });
    });

    it('navigates back when clicking Cancelar', async () => {
        mockFetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [{ id: '1', name: 'Ingeniería' }],
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [{ id: '2', name: 'Facultad Ingeniería' }],
            });

        render(<OfferCreateFormDependence />);

        // Esperar carga inicial
        await waitFor(() => screen.getByText('Ingeniería'));

        const cancelButton = screen.getByText('Cancelar');
        fireEvent.click(cancelButton);

        expect(navigateMock).toHaveBeenCalledWith('/dependence/offers');
    });
});
