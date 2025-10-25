import type { JSX } from 'react';
import * as auth from '@/hooks/useAuth';
import ProtectedWrapper from '../ProtectedWrapper';
import { render } from '@testing-library/react';

vi.mock('react-router-dom', () => {
	return {
		Outlet: () => <div>Outlet</div>,
		Navigate: ({ to }: { to: string }) => <div>Navigate to {to}</div>,
	};
});

vi.mock('@/hooks/useUserData', () => {
	return {
		UserDataProvider: (props: { children: JSX.Element }) => <div>{props.children}</div>,
	};
});

describe('ProtectedWrapper', () => {
	it('should render loading state when status is unresolved', () => {
		vi.spyOn(auth, 'useAuth').mockReturnValue({ status: 'unresolved' } as any);
		const { getByText } = render(<ProtectedWrapper />);
		const loading = getByText('Loading...');
		expect(loading).toBeInTheDocument();
	});

	it('should redirect to login when status is unauthenticated', () => {
		vi.spyOn(auth, 'useAuth').mockReturnValue({ status: 'unauthenticated' } as any);
		const { getByText } = render(<ProtectedWrapper />);
		const navigate = getByText('Navigate to /auth/login');
		expect(navigate).toBeInTheDocument();
	});

	it('should render Outlet when status is authenticated', () => {
		vi.spyOn(auth, 'useAuth').mockReturnValue({ status: 'authenticated' } as any);
		const { getByText } = render(<ProtectedWrapper />);
		const outlet = getByText('Outlet');
		expect(outlet).toBeInTheDocument();
	});
});
