import { useUserData } from './useUserData';
import { allowdNavigateRoute } from './configRoute';
import { Route, useRoutes } from 'react-router-dom';
import NoPermission from '@/components/NoPermission';

export function BuildRoutesByPermissions() {
    const { userData } = useUserData();

    const permissions = userData?.role?.permission?.map(rp => rp.permission.code) || [];
    const allowedRoutes = allowdNavigateRoute(permissions);

    const routes = ([
        ...allowedRoutes,
        { path: "/403", element: <NoPermission /> },
        { path: "*", element: <div>404 Not Found</div> },
    ]);

    return <>{routes.map(e => <Route key={e.path} element={e.element} path={e.path} />)}</>;
}

