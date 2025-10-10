import { render } from '@testing-library/react';
import AuthLayout from '../AuthLayout';

vi.mock('react-router-dom', () => {
	return {
		Outlet: () => <div>Outlet</div>,
	};
});

vi.mock('../Navbar', () => {
	return {
		default: () => <div>Navbar</div>,
	};
});

describe('AuthLayout', () => {
	it('should render correctly', () => {
		const { getByText } = render(<AuthLayout />);
		const outlet = getByText('Outlet');
		const navbar = getByText('Navbar');

		expect(outlet).toBeInTheDocument();
		expect(navbar).toBeInTheDocument();
	});
});
