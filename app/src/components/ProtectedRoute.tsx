import { Navigate, Outlet } from 'react-router-dom';
import { useUserData } from '@/hooks/useUserData';
import type { ReactNode } from 'react';

type ProtectedProps = {
	requiredPermissions?: string[];
	children?: ReactNode;
};

export function ProtectedRoute({ requiredPermissions = [], children }: ProtectedProps) {
	const { userData, loading } = useUserData();
	const permissions = userData?.role?.permission?.map(rp => rp.permission.code) || [];

	if (loading) return <div>Loading...</div>;

	if (requiredPermissions.length > 0 && !requiredPermissions.every(p => permissions.includes(p))) {
		return <Navigate to="/403" replace />;
	}

	return <>{children || <Outlet />}</>;
}
