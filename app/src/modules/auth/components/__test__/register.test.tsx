import { render, waitFor } from '@testing-library/react';
import RegisterForm from '../RegisterForm';
import * as request from '../../requests/register';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';

const collegesMock = [{ id: '1', name: 'Escuela 1', facultyId: '1' }];
const user = userEvent.setup();

const navigateMock = vi.fn();
vi.mock('react-router-dom', () => {
	return {
		useNavigate: () => navigateMock,
	};
});

describe('Register Page', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should render the register form', async () => {
		const { getByText, getByPlaceholderText } = render(<RegisterForm colleges={collegesMock} />);

		const titleElement = getByText('Crear cuenta');
		const nameInput = getByPlaceholderText('Ingresa tu nombre');
		const lastNameInput = getByPlaceholderText('Ingresa tu apellido');
		const emailInput = getByPlaceholderText('Ingresa tu correo');
		const collegeSelect = getByText('Selecciona tu escuela');
		const passwordInput = getByPlaceholderText('Ingresa tu contraseña');
		const submitButton = getByText('Crear cuenta');

		await waitFor(() => {
			expect(titleElement).toBeInTheDocument();
			expect(nameInput).toBeInTheDocument();
			expect(lastNameInput).toBeInTheDocument();
			expect(emailInput).toBeInTheDocument();
			expect(collegeSelect).toBeInTheDocument();
			expect(passwordInput).toBeInTheDocument();
			expect(submitButton).toBeInTheDocument();
		});
	});

	for (const test of validateTestCases) {
		it(test.title, async () => {
			const { getByText, getByPlaceholderText, getByRole } = render(<RegisterForm colleges={collegesMock} />);
			const nameInput = getByPlaceholderText('Ingresa tu nombre');
			const lastNameInput = getByPlaceholderText('Ingresa tu apellido');
			const emailInput = getByPlaceholderText('Ingresa tu correo');
			const collegeSelect = getByRole('combobox');
			const passwordInput = getByPlaceholderText('Ingresa tu contraseña');
			const confirmPasswordInput = getByPlaceholderText('Confirma tu contraseña');
			const submitButton = getByText('Registrar');

			if (test.name) await user.type(nameInput, test.name);
			if (test.lastName) await user.type(lastNameInput, test.lastName);
			if (test.email) await user.type(emailInput, test.email);
			if (test.selectCollege) await user.selectOptions(collegeSelect, '1');
			if (test.password) await user.type(passwordInput, test.password);
			if (test.confirmPassword) await user.type(confirmPasswordInput, test.confirmPassword);

			await user.click(submitButton);

			await waitFor(() => {
				if (test.nameError) {
					expect(getByText(test.nameError)).toBeInTheDocument();
				}
				if (test.lastNameError) {
					expect(getByText(test.lastNameError)).toBeInTheDocument();
				}
				if (test.emailError) {
					expect(getByText(test.emailError)).toBeInTheDocument();
				}
				if (test.collegeError) {
					expect(getByText(test.collegeError)).toBeInTheDocument();
				}
				if (test.passwordError) {
					expect(getByText(test.passwordError)).toBeInTheDocument();
				}
				if (test.confirmPasswordError) {
					expect(getByText(test.confirmPasswordError)).toBeInTheDocument();
				}
			});
		});
	}

	for (const test of requestErrorTestCases) {
		it(test.name, async () => {
			const toastMock = vi.spyOn(toast, 'error');
			const requestMock = vi.spyOn(request, 'registerRequets').mockResolvedValue({
				status: test.status,
				ok: true,
			} as Response);

			const { getByText, getByPlaceholderText, getByRole } = render(<RegisterForm colleges={collegesMock} />);
			const nameInput = getByPlaceholderText('Ingresa tu nombre');
			const lastNameInput = getByPlaceholderText('Ingresa tu apellido');
			const emailInput = getByPlaceholderText('Ingresa tu correo');
			const collegeSelect = getByRole('combobox');
			const passwordInput = getByPlaceholderText('Ingresa tu contraseña');
			const confirmPasswordInput = getByPlaceholderText('Confirma tu contraseña');
			const submitButton = getByText('Registrar');

			await user.type(nameInput, 'John');
			await user.type(lastNameInput, 'Doe');
			await user.type(emailInput, 'johndoe@gmail.com');
			await user.selectOptions(collegeSelect, 'Escuela 1');
			await user.type(passwordInput, 'password123');
			await user.type(confirmPasswordInput, 'password123');
			await user.click(submitButton);

			await waitFor(() => {
				expect(requestMock).toHaveBeenCalled();
				expect(navigateMock).not.toHaveBeenCalled();
				expect(toastMock).toHaveBeenCalledWith(test.errorMessage);
			});
		});
	}

	it('registers a user successfully', async () => {
		const requestMock = vi.spyOn(request, 'registerRequets').mockResolvedValue({
			status: 200,
			ok: true,
		} as Response);

		const { getByText, getByPlaceholderText, getByRole } = render(<RegisterForm colleges={collegesMock} />);
		const nameInput = getByPlaceholderText('Ingresa tu nombre');
		const lastNameInput = getByPlaceholderText('Ingresa tu apellido');
		const emailInput = getByPlaceholderText('Ingresa tu correo');
		const collegeSelect = getByRole('combobox');
		const passwordInput = getByPlaceholderText('Ingresa tu contraseña');
		const confirmPasswordInput = getByPlaceholderText('Confirma tu contraseña');
		const submitButton = getByText('Registrar');

		await user.type(nameInput, 'John');
		await user.type(lastNameInput, 'Doe');
		await user.type(emailInput, 'johndoe@gmail.com');
		await user.selectOptions(collegeSelect, 'Escuela 1');
		await user.type(passwordInput, 'password123');
		await user.type(confirmPasswordInput, 'password123');
		await user.click(submitButton);

		await waitFor(() => {
			expect(requestMock).toHaveBeenCalled();
			expect(navigateMock).toHaveBeenCalledWith('/auth/login');
		});
	});
});

const requestErrorTestCases = [
	{
		status: 400,
		errorMessage: 'El usuario ya existe o hay un error en los datos.',
		name: 'shows error when user already exists',
	},
	{
		status: 500,
		errorMessage: 'Error al registrar el usuario.',
		name: 'shows error on server error',
	},
	{
		status: 404,
		errorMessage: 'Rol no encontrado.',
		name: 'shows error when role not found',
	},
];

const validateTestCases = [
	{
		email: '',
		password: '',
		confirmPassword: '',
		name: '',
		lastName: '',
		selectCollege: false,
		emailError: 'El correo electrónico no es válido',
		passwordError: 'La contraseña debe tener al menos 6 caracteres',
		nameError: 'El nombre es requerido',
		lastNameError: 'El apellido es requerido',
		collegeError: 'La escuela es requerida',
		title: 'shows validation errors for empty inputs',
	},
	{
		email: 'invalid-email',
		title: 'shows validation error for invalid email',
		emailError: 'El correo electrónico no es válido',
	},
	{
		password: '123',
		confirmPassword: '123',
		title: 'shows validation error for short password',
	},
	{
		password: 'password123',
		confirmPassword: 'different123',
		title: 'shows validation error for non-matching passwords',
		confirmPasswordError: 'Las contraseñas no coinciden',
	},
	{
		confirmPassword: '123',
		title: 'shows validation error for empty name',
	},
];
