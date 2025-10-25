import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import OfferCreateForm from '../OfferCreateForm';
import { vi } from 'vitest';

const navigateMock = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => navigateMock,
}));

const createAuthFetchOptionsMock = vi.fn().mockResolvedValue({
    headers: { Authorization: 'Bearer token' },
});
vi.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({
        createAuthFetchOptions: createAuthFetchOptionsMock,
    }),
}));

const mockFetch = vi.fn();
global.fetch = mockFetch as unknown as typeof fetch;

describe('OfferCreateForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the form and loads select options correctly', async () => {
        mockFetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [{ id: '1', name: 'Ingeniería' }],
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [{ id: '2', name: 'Facultad Ingeniería' }],
            });

        render(<OfferCreateForm />);

        await waitFor(() => {
            expect(screen.getByText('Ingeniería')).toBeInTheDocument();
            expect(screen.getByText('Facultad Ingeniería')).toBeInTheDocument();
        });

        const collegeSelect = screen.getByLabelText('Escuela');
        expect(within(collegeSelect).getByText('Ingeniería')).toBeInTheDocument();

        const facultySelect = screen.getByLabelText('Facultad');
        expect(within(facultySelect).getByText('Facultad Ingeniería')).toBeInTheDocument();
    });

    it('submits the form successfully and navigates after creation', async () => {
        mockFetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [{ id: '1', name: 'Ingeniería' }],
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [{ id: '2', name: 'Facultad Ingeniería' }],
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({}),
            });

        render(<OfferCreateForm />);

        await waitFor(() => screen.getByText('Ingeniería'));

        fireEvent.change(screen.getByPlaceholderText('Ingrese el titulo'), {
            target: { value: 'Nueva Oferta' },
        });
        fireEvent.change(screen.getByPlaceholderText('Ingrese la descripción'), {
            target: { value: 'Descripción de prueba' },
        });
        fireEvent.change(screen.getByPlaceholderText('Ingrese los requisitos'), {
            target: { value: 'Requisitos de prueba' },
        });
        fireEvent.change(screen.getByLabelText('Escuela'), { target: { value: '1' } });
        fireEvent.change(screen.getByLabelText('Facultad'), { target: { value: '2' } });

        const dateInput = screen.getByLabelText('Fecha de cierre');
        const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
        fireEvent.change(dateInput, { target: { value: tomorrow } });

        const submitButton = screen.getByText('Crear oferta');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledTimes(3);
            expect(navigateMock).toHaveBeenCalledWith('/admin/offers');
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

        render(<OfferCreateForm />);

        await waitFor(() => screen.getByText('Ingeniería'));

        const cancelButton = screen.getByText('Cancelar');
        fireEvent.click(cancelButton);

        expect(navigateMock).toHaveBeenCalledWith('/admin/offers');
    });
});
