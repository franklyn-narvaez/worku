import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import { vi } from 'vitest';
import UpdateForm from '../UpdateForm';
import type { Offer, College, Faculty } from '@prisma/client';

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

const mockOffer: Offer & {
    college: {
        id: string;
        name: string;
    } | null;
    faculty: {
        id: string;
        name: string;
    } | null;
} = {
    id: '1',
    title: 'Oferta existente',
    description: 'Descripción existente',
    requirements: 'Requisitos existentes',
    collegeId: '1',
    facultyId: '2',
    closeDate: new Date(),
    status: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    college: { id: '1', name: 'Ingeniería' },
    faculty: { id: '2', name: 'Facultad Ingeniería' },
};

const mockCollege: College[] = [{ id: '1', name: 'Ingeniería', facultyId: '1' }];
const mockFaculty: Faculty[] = [{ id: '2', name: 'Facultad Ingeniería' }];

describe('UpdateForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the form with existing offer data', async () => {
        render(<UpdateForm offer={mockOffer} college={mockCollege} faculty={mockFaculty} />);

        expect(screen.getByDisplayValue('Oferta existente')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Descripción existente')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Requisitos existentes')).toBeInTheDocument();

        const collegeSelect = screen.getByLabelText('Escuela');
        expect(within(collegeSelect).getByText('Ingeniería')).toBeInTheDocument();

        const facultySelect = screen.getByLabelText('Facultad');
        expect(within(facultySelect).getByText('Facultad Ingeniería')).toBeInTheDocument();

        expect(screen.getByLabelText('Fecha de cierre')).toBeInTheDocument();
    });

    it('submits the form successfully and navigates after update', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({}),
        });

        render(<UpdateForm offer={mockOffer} college={mockCollege} faculty={mockFaculty} />);

        fireEvent.change(screen.getByPlaceholderText('Ingrese el titulo'), {
            target: { value: 'Oferta actualizada' },
        });
        fireEvent.change(screen.getByPlaceholderText('Ingrese la descripción'), {
            target: { value: 'Descripción actualizada' },
        });

        fireEvent.change(screen.getByLabelText('Estado'), {
            target: { value: 'false' },
        });

        const dateInput = screen.getByLabelText('Fecha de cierre');
        const newDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];
        fireEvent.change(dateInput, { target: { value: newDate } });

        const submitButton = screen.getByText('Actualziar oferta');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledTimes(1);
            const [url, options] = mockFetch.mock.calls[0];
            expect(url).toContain('/update');
            expect(options.method).toBe('PATCH');
            expect(JSON.parse(options.body)).toMatchObject({
                id: '1',
                title: 'Oferta actualizada',
                description: 'Descripción actualizada',
                status: false,
            });
            expect(navigateMock).toHaveBeenCalledWith('/admin/offers');
        });
    });

    it('navigates back when clicking Cancelar', async () => {
        render(<UpdateForm offer={mockOffer} college={mockCollege} faculty={mockFaculty} />);

        const cancelButton = screen.getByText('Cancelar');
        fireEvent.click(cancelButton);

        expect(navigateMock).toHaveBeenCalledWith('/admin/offers');
    });
});
