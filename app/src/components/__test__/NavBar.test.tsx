import { render } from '@testing-library/react';
import type { JSX } from 'react';
import Navbar from '../Navbar';

vi.mock('react-router-dom', () => {
	return {
		Link: (props: { children: JSX.Element }) => <div>{props.children}</div>,
	};
});

describe('NavBar', () => {
	it('should render the NavBar component', () => {
		const { getByText } = render(<Navbar />);

		const title = getByText('WorkU');
		const inicioLink = getByText('Inicio');
		const loginLink = getByText('Iniciar sesión');
		const registerLink = getByText('Registrar');

		expect(title).toBeInTheDocument();
		expect(inicioLink).toBeInTheDocument();
		expect(loginLink).toBeInTheDocument();
		expect(registerLink).toBeInTheDocument();
	});
});
