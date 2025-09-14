import { useUserData } from "@/hooks/useUserData";
import { allowdNavigateRoute, routeConfig, type AppRoute } from "./configRoute";

function getSidebarRoutes(routes: AppRoute[]): AppRoute[] {
    return routes.flatMap(route =>
        route.children ? getSidebarRoutes(route.children) : [route]
    );
}

export function useSidebarRoutes() {
    const { userData } = useUserData();

    const permissions = userData?.role?.permission?.map(rp => rp.permission.code) || [];

    // 1️⃣ Generamos todas las rutas, sin filtrarlas
    const allowedRoutes = allowdNavigateRoute(permissions, routeConfig);

    // 2️⃣ Aplanamos la estructura
    const allNestedRoutes = getSidebarRoutes(allowedRoutes);

    // 3️⃣ Filtramos SOLO para el sidebar
    return allNestedRoutes.filter(route => {
        if (!route.showInSidebar) return false;
        if (route.requiredPermission && !permissions.includes(route.requiredPermission)) {
            return false;
        }
        return true;
    });
}
