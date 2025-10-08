import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../Login";
import * as auth from "@/hooks/useAuth";
import "@testing-library/jest-dom";
import { toast } from "react-toastify";

const userMock = userEvent.setup();

const navigateMock = vi.fn();
vi.mock("react-router-dom", () => {
	return {
		useNavigate: () => navigateMock,
		Navigate: (props: { to: string }) => {
			navigateMock();
			return <div>Redirected to {props.to}</div>;
		},
	};
});

describe("Login Page", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should show loading state when status is unresolved", () => {
		vi.spyOn(auth, "useAuth").mockReturnValue({
			status: "unresolved",
			login: vi.fn(),
			logout: vi.fn(),
			createAuthFetchOptions: vi.fn(),
			refresh: vi.fn(),
		});
		const { getByText } = render(<Login />);
		const loadingElement = getByText("Loading...");
		expect(loadingElement).toBeInTheDocument();
	});

	it("should redirect to dashboard when authenticated", () => {
		vi.spyOn(auth, "useAuth").mockReturnValue({
			status: "authenticated",
			login: vi.fn(),
			logout: vi.fn(),
			createAuthFetchOptions: vi.fn(),
			refresh: vi.fn(),
		});
		const { getByText } = render(<Login />);
		const redirectElement = getByText("Redirected to /dashboard");
		expect(redirectElement).toBeInTheDocument();
		expect(navigateMock).toHaveBeenCalled();
	});

	it("should render the login form", () => {
		vi.spyOn(auth, "useAuth").mockReturnValue({
			status: "unauthenticated",
			login: vi.fn(),
			logout: vi.fn(),
			createAuthFetchOptions: vi.fn(),
			refresh: vi.fn(),
		});
		const { getByText, getByPlaceholderText } = render(<Login />);
		const title = getByText("Inicio de sesión");
		const loginButton = getByText("Iniciar sesión");
		const emailInput = getByPlaceholderText("Ingresa tu correo electrónico");
		const passwordInput = getByPlaceholderText("Ingresa tu contraseña");

		expect(emailInput).toBeInTheDocument();
		expect(passwordInput).toBeInTheDocument();
		expect(loginButton).toBeInTheDocument();
		expect(title).toBeInTheDocument();
	});

	for (const test of validateTestCases) {
		it(test.name, async () => {
			vi.spyOn(auth, "useAuth").mockReturnValue({
				status: "unauthenticated",
				login: vi.fn(),
				logout: vi.fn(),
				createAuthFetchOptions: vi.fn(),
				refresh: vi.fn(),
			});
			render(<Login />);
			const emailInput = screen.getByPlaceholderText(
				"Ingresa tu correo electrónico",
			);
			const passwordInput = screen.getByPlaceholderText(
				"Ingresa tu contraseña",
			);
			const loginButton = screen.getByText("Iniciar sesión");

			if (test.email) {
				await userMock.type(emailInput, test.email);
			}

			if (test.password) {
				await userMock.type(passwordInput, test.password);
			}

			await userMock.click(loginButton);

			if (test.emailError) {
				const emailError = screen.getByText(test.emailError);

				await waitFor(() => {
					expect(emailError).toBeInTheDocument();
				});
			}

			if (test.passwordError) {
				const passwordError = screen.getByText(test.passwordError);

				await waitFor(() => {
					expect(passwordError).toBeInTheDocument();
				});
			}
		});
	}

	for (const test of requestErrorTestCases) {
		it(test.name, async () => {
			const toastMock = vi.spyOn(toast, "error").mockReturnValue("");
			const loginMock = vi.fn().mockResolvedValue({ status: test.status });
			vi.spyOn(auth, "useAuth").mockReturnValue({
				status: "unauthenticated",
				login: loginMock,
				logout: vi.fn(),
				createAuthFetchOptions: vi.fn(),
				refresh: vi.fn(),
			});

			const { getByPlaceholderText, getByText } = render(<Login />);

			const emailInput = getByPlaceholderText("Ingresa tu correo electrónico");
			const passwordInput = getByPlaceholderText("Ingresa tu contraseña");
			const loginButton = getByText("Iniciar sesión");

			await userMock.type(emailInput, "test@gmail.com");
			await userMock.type(passwordInput, "12345678");
			await userMock.click(loginButton);

			await waitFor(() => {
				expect(navigateMock).not.toHaveBeenCalled();
				expect(loginMock).toHaveBeenCalled();
				expect(toastMock).toHaveBeenCalledWith(test.errorMessage);
			});
		});
	}

	it("login successfully", async () => {
		const toastMock = vi.spyOn(toast, "success").mockReturnValue("");
		const loginMock = vi.fn().mockResolvedValue({ status: 200 });
		vi.spyOn(auth, "useAuth").mockReturnValue({
			status: "unauthenticated",
			login: loginMock,
			logout: vi.fn(),
			createAuthFetchOptions: vi.fn(),
			refresh: vi.fn(),
		});

		const { getByPlaceholderText, getByText } = render(<Login />);

		const emailInput = getByPlaceholderText("Ingresa tu correo electrónico");
		const passwordInput = getByPlaceholderText("Ingresa tu contraseña");
		const loginButton = getByText("Iniciar sesión");

		await userMock.type(emailInput, "test@gmail.com");
		await userMock.type(passwordInput, "12345678");
		await userMock.click(loginButton);

		await waitFor(() => {
			expect(navigateMock).toHaveBeenCalledWith("/dashboard");
			expect(loginMock).toHaveBeenCalled();
			expect(toastMock).toHaveBeenCalledWith("¡Inicio de sesión exitoso!");
		});
	});
});

const requestErrorTestCases = [
	{
		status: 400,
		errorMessage: "Datos invalidos.",
		name: "should show error message for status 400",
	},
	{
		status: 401,
		errorMessage: "Usuario o contraseña no válidos.",
		name: "should show error message for status 401",
	},
	{
		status: 500,
		errorMessage: "Error del servidor, intenta nuevamente.",
		name: "should show error message for status 500",
	},
];

const validateTestCases = [
	{
		email: "",
		password: "",
		emailError: "El correo electrónico no es válido",
		passwordError: "La contraseña debe tener al menos 6 caracteres",
		name: "should show error messages for empty fields",
	},
	{
		email: "test@example.com",
		password: "",
		emailError: "",
		passwordError: "La contraseña debe tener al menos 6 caracteres",
		name: "should show error message for empty password",
	},
	{
		email: "",
		password: "12345678",
		emailError: "El correo electrónico no es válido",
		passwordError: "",
		name: "should show error message for empty email",
	},
	{
		email: "email",
		password: "1234",
		emailError: "El correo electrónico no es válido",
		passwordError: "La contraseña debe tener al menos 6 caracteres",
		name: "should show error messages for invalid email and password",
	},
];
