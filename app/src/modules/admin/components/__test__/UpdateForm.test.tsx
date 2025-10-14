import { render, waitFor } from '@testing-library/react';
import UpdateForm from '../UpdateForm';
import type { ExtendedUser } from '../../types/user';

const collegesMock = [{ id: '1', name: 'Escuela 1', facultyId: '1' }];
const rolesMock = [{ id: '1', name: 'Role 1', code: 'ROLE1' }];
const userMock: ExtendedUser = {
	id: '1',
	name: 'John',
	lastName: 'Doe',
	email: 'jhon@correo.com',
	college: { id: '1', name: 'Escuela 1' },
	collegeId: '1',
	createdDate: new Date('2023-01-15T00:00:00Z'),
	updatedDate: new Date(),
	status: 'ACTIVE',
	roleId: '1',
	password: 'hashedpassword',
};

const navigateMock = vi.fn();
vi.mock('react-router-dom', () => {
	return {
		useNavigate: () => navigateMock,
	};
});

describe('UpdateForm', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should render the update form with user data', async () => {
		const { getByText } = render(<UpdateForm user={userMock} college={collegesMock} role={rolesMock} />);

		const titleElement = getByText('Actualizar Usuario');
		const nameInput = getByText('Nombre');
		const lastNameInput = getByText('Apellido');
		const emailInput = getByText('Correo Electrónico');
		const collegeSelect = getByText('Escuela 1');
		const roleSelect = getByText('Role 1');
		const statusSelect = getByText('Activo');
		const submitButton = getByText('Actualizar');

		await waitFor(() => {
			expect(titleElement).toBeInTheDocument();
			expect(nameInput).toBeInTheDocument();
			expect(lastNameInput).toBeInTheDocument();
			expect(emailInput).toBeInTheDocument();
			expect(collegeSelect).toBeInTheDocument();
			expect(roleSelect).toBeInTheDocument();
			expect(statusSelect).toBeInTheDocument();
			expect(submitButton).toBeInTheDocument();
		});
	});
});
