import userEvent from '@testing-library/user-event';
import CreateForm from '../CreateForm';
import { render, waitFor } from '@testing-library/react';
import * as request from '../../requests/create';

const collegesMock = [{ id: '1', name: 'Escuela 1', facultyId: '1' }];
const rolesMock = [{ id: '1', name: 'Role 1', code: 'ROLE1' }];
const user = userEvent.setup();

const navigateMock = vi.fn();
vi.mock('react-router-dom', () => {
	return {
		useNavigate: () => navigateMock,
	};
});

describe('create form', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should render the create form', () => {
		const { getByText, getByPlaceholderText } = render(<CreateForm colleges={collegesMock} roles={rolesMock} />);

		const titleElement = getByText('Crear Usuario');
		const nameInput = getByPlaceholderText('Ingrese su nombre');
		const lastNameInput = getByPlaceholderText('Ingrese su apellido');
		const emailInput = getByPlaceholderText('Ingrese su correo electrónico');
		const collegeSelect = getByText('Selecciona una escuela');
		const roleSelect = getByText('Selecciona un rol');
		const submitButton = getByText('Crear');

		expect(titleElement).toBeInTheDocument();
		expect(nameInput).toBeInTheDocument();
		expect(lastNameInput).toBeInTheDocument();
		expect(emailInput).toBeInTheDocument();
		expect(collegeSelect).toBeInTheDocument();
		expect(roleSelect).toBeInTheDocument();
		expect(submitButton).toBeInTheDocument();
	});

	for (const testCase of validateTestCases) {
		it(testCase.title, async () => {
			const { getByText, getByPlaceholderText, getAllByRole } = render(
				<CreateForm colleges={collegesMock} roles={rolesMock} />,
			);

			const nameInput = getByPlaceholderText('Ingrese su nombre');
			const lastNameInput = getByPlaceholderText('Ingrese su apellido');
			const emailInput = getByPlaceholderText('Ingrese su correo electrónico');
			const selects = getAllByRole('combobox');
			const submitButton = getByText('Crear');

			if (testCase.name) {
				await user.type(nameInput, testCase.name);
			}
			if (testCase.lastName) {
				await user.type(lastNameInput, testCase.lastName);
			}
			if (testCase.email) {
				await user.type(emailInput, testCase.email);
			}
			if (testCase.collegeId) {
				await user.selectOptions(selects[0], '1');
			}
			if (testCase.roleId) {
				await user.selectOptions(selects[1], '1');
			}
			await user.click(submitButton);

			await waitFor(async () => {
				if (testCase.nameError) {
					const errorMsg = getByText(testCase.nameError);
					expect(errorMsg).toBeInTheDocument();
				}
				if (testCase.lastNameError) {
					const errorMsg = getByText(testCase.lastNameError);
					expect(errorMsg).toBeInTheDocument();
				}
				if (testCase.emailError) {
					const errorMsg = getByText(testCase.emailError);
					expect(errorMsg).toBeInTheDocument();
				}
				if (testCase.collegeIdError) {
					const errorMsg = getByText(testCase.collegeIdError);
					expect(errorMsg).toBeInTheDocument();
				}
				if (testCase.roleIdError) {
					const errorMsg = getByText(testCase.roleIdError);
					expect(errorMsg).toBeInTheDocument();
				}
			});
		});
	}

	it('error on request', async () => {
		const requestMock = vi.spyOn(request, 'createUser').mockResolvedValue(
			new Response(JSON.stringify({ message: 'Error creating user' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		const { getByText, getByPlaceholderText, getAllByRole } = render(
			<CreateForm colleges={collegesMock} roles={rolesMock} />,
		);

		const nameInput = getByPlaceholderText('Ingrese su nombre');
		const lastNameInput = getByPlaceholderText('Ingrese su apellido');
		const emailInput = getByPlaceholderText('Ingrese su correo electrónico');
		const selects = getAllByRole('combobox');
		const submitButton = getByText('Crear');

		await user.type(nameInput, 'John');
		await user.type(lastNameInput, 'Doe');
		await user.type(emailInput, 'johndoe@email.com');
		await user.selectOptions(selects[0], '1');
		await user.selectOptions(selects[1], '1');
		await user.click(submitButton);

		await waitFor(() => {
			expect(requestMock).toHaveBeenCalled();
			expect(navigateMock).not.toHaveBeenCalled();
		});
	});

	it('create successfully', async () => {
		const requestMock = vi.spyOn(request, 'createUser').mockResolvedValue(new Response(null, { status: 201 }));
		const { getByText, getByPlaceholderText, getAllByRole } = render(
			<CreateForm colleges={collegesMock} roles={rolesMock} />,
		);

		const nameInput = getByPlaceholderText('Ingrese su nombre');
		const lastNameInput = getByPlaceholderText('Ingrese su apellido');
		const emailInput = getByPlaceholderText('Ingrese su correo electrónico');
		const selects = getAllByRole('combobox');
		const submitButton = getByText('Crear');

		await user.type(nameInput, 'John');
		await user.type(lastNameInput, 'Doe');
		await user.type(emailInput, 'johndoe@email.com');
		await user.selectOptions(selects[0], '1');
		await user.selectOptions(selects[1], '1');
		await user.click(submitButton);

		await waitFor(() => {
			expect(requestMock).toHaveBeenCalled();
			expect(navigateMock).toHaveBeenCalledWith('/admin/users');
		});
	});
});

const validateTestCases = [
	{
		email: '',
		name: '',
		lastName: '',
		collegeId: false,
		roleId: false,
		emailError: 'El correo electrónico no es válido',
		nameError: 'El nombre es requerido',
		lastNameError: 'El apellido es requerido',
		collegeIdError: 'La escuela es requerida',
		roleIdError: 'El rol es requerido',
		title: 'should show required errors when fields are empty',
	},
	{
		title: 'should show email error when email is invalid',
		email: 'invalid-email',
		emailError: 'El correo electrónico no es válido',
	},
];
