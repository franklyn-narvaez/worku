import { render } from "@testing-library/react";
import Login from "../Login";
import * as auth from "@/hooks/useAuth";

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
});
