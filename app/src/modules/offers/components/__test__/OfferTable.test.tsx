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
		const offerDescription = getByText('Descripcion 1');
		const offerRequirements = getByText('Requisitos 1');
		const offerCollege = getByText('Escuela 1');

		const offerCreatedAt = getByText((text) => /14\/1\/2023|1\/14\/2023/.test(text));
		const offerUpdatedAt = getByText((text) => /19\/1\/2023|1\/19\/2023/.test(text));
		const offerCloseDate = getByText((text) => /30\/12\/2023|12\/30\/2023/.test(text));

		const offerStatus = getByText('Activa');
		const editButton = getByText('Editar');

		expect(titleElement).toBeInTheDocument();
		expect(offerTitle).toBeInTheDocument();
		expect(offerDescription).toBeInTheDocument();
		expect(offerRequirements).toBeInTheDocument();
		expect(offerCollege).toBeInTheDocument();
		expect(offerCreatedAt).toBeInTheDocument();
		expect(offerUpdatedAt).toBeInTheDocument();
		expect(offerCloseDate).toBeInTheDocument();
		expect(offerStatus).toBeInTheDocument();
		expect(editButton).toBeInTheDocument();
	});

});
