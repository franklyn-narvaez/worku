import { BrowserRouter } from 'react-router-dom';
import { BuildRoutesByPermissions } from './hooks/buildRoutes';

function Router() {
	return (
		<BrowserRouter>
			<BuildRoutesByPermissions />
		</BrowserRouter>
	);
}

export default Router;
