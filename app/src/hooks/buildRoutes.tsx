// hooks/buildRoutes.tsx
import { useUserData } from './useUserData';
import { allowdNavigateRoute, routeConfig } from './configRoute';
import { useRoutes } from 'react-router-dom';

export function BuildRoutesByPermissions() {
	const { userData } = useUserData();

	const permissions = userData?.role?.permission?.map(rp => rp.permission.code) || [];

	const allowedRoutes = allowdNavigateRoute(permissions, routeConfig);

	return useRoutes(allowedRoutes);
}
