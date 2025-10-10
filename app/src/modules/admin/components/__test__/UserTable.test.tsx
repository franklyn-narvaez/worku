import userEvent from '@testing-library/user-event';
import type { ExtendedUser } from '../../types/user';
import { render, waitFor } from '@testing-library/react';
import UserTable from '../UserTable';

const user = userEvent.setup();
const usersMock: ExtendedUser[] = [
	{
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
	},
];
const navigateMock = vi.fn();
vi.mock('react-router-dom', () => {
	return {
		useNavigate: () => navigateMock,
	};
});

describe('UserTable', () => {
	it('should render correctly', () => {
		const { getByText } = render(<UserTable users={usersMock} />);

		const nameElement = getByText('John');
		const lastNameElement = getByText('Doe');
		const emailElement = getByText('jhon@correo.com');
		const collegeElement = getByText('Escuela 1');
		const dateElement = getByText('1/14/2023');
		const statusElement = getByText('Activo');
		const editButton = getByText('Editar');

		expect(nameElement).toBeInTheDocument();
		expect(lastNameElement).toBeInTheDocument();
		expect(emailElement).toBeInTheDocument();
		expect(collegeElement).toBeInTheDocument();
		expect(dateElement).toBeInTheDocument();
		expect(statusElement).toBeInTheDocument();
		expect(editButton).toBeInTheDocument();
	});

	it('should navigate to edit page on edit button click', async () => {
		const { getByText } = render(<UserTable users={usersMock} />);

		const editButton = getByText('Editar');
		await user.click(editButton);

		await waitFor(() => {
			expect(navigateMock).toHaveBeenCalledWith('/admin/users/update/1');
		});
	});
});
