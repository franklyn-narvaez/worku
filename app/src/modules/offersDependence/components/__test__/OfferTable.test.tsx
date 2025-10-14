import { render } from '@testing-library/react';
import OfferTable from '../OfferTable';
import type { ExtendedOffer } from '../../types/offer';

const offersMock: ExtendedOffer[] = [
	{
		id: '1',
		title: 'Oferta 1',
		description: 'Descripcion 1',
		requirements: 'Requisitos 1',
		collegeId: '1',
		facultyId: null,
		createdAt: new Date('2023-01-15T00:00:00Z'),
		updatedAt: new Date('2023-01-20T00:00:00Z'),
		closeDate: new Date('2023-12-31T00:00:00Z'),
		status: true,
		college: { id: '1', name: 'Escuela 1' },
		count: {
			Application: 0,
		},
	},
];

const navigateMock = vi.fn();
vi.mock('react-router-dom', () => {
	return {
		useNavigate: () => navigateMock,
	};
});

describe('OfferTable', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should render', () => {
		const { getByText } = render(<OfferTable offers={offersMock} />);

		const titleElement = getByText('Lista de ofertas');
		const offerTitle = getByText('Oferta 1');
		const offerCollege = getByText('Escuela 1');
		const offerCreatedAt = getByText('1/14/2023');
		const offerUpdatedAt = getByText('1/19/2023');
		const offerCloseDate = getByText('12/30/2023');
		const offerStatus = getByText('Activa');

		expect(titleElement).toBeInTheDocument();
		expect(offerTitle).toBeInTheDocument();
		expect(offerCollege).toBeInTheDocument();
		expect(offerCreatedAt).toBeInTheDocument();
		expect(offerUpdatedAt).toBeInTheDocument();
		expect(offerCloseDate).toBeInTheDocument();
		expect(offerStatus).toBeInTheDocument();
	});
});
