
import AuthLayout from "@/components/AuthLayout";
import NavWrapper from "@/components/NavWrapper";
import NoPermission from "@/components/NoPermission";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import ProtectedWrapper from "@/components/ProtectedWrapper";

import { ADMIN_OFFER, ADMIN_USER, OFFER_CREATE, OFFER_UPDATE, USER_CREATE, USER_UPDATE } from "@/constants/path";
import CreateForm from "@/modules/admin/components/CreateForm";
import Users from "@/modules/admin/pages/Users";
import UserUpdate from "@/modules/admin/pages/UserUpdate";
import Login from "@/modules/auth/pages/Login";
import Register from "@/modules/auth/pages/Register";
import OfferCreateForm from "@/modules/offers/components/OfferCreateForm";
import Offers from "@/modules/offers/pages/Offers";
import OfferUpdate from "@/modules/offers/pages/OfferUpdate";
import { BookOpen, Home, Users as UsersIcon } from "lucide-react";
import type { ComponentType, ReactElement } from "react";

export type AppRoute = {
  path?: string,
  element: ReactElement,
  children?: AppRoute[]
  requiredPermission?: string
  title?: string,
  showInSidebar?: boolean,
  icon?: ComponentType;
}

export function allowdNavigateRoute(
  permissions: string[],
  routes: AppRoute[] = routeConfig
): AppRoute[] {
  return routes
    .map((route, index) => {
      const children = route.children
        ? allowdNavigateRoute(permissions, route.children)
        : undefined;

      const element = route.requiredPermission ? (
        <ProtectedRoute
          key={route.path || index}
          requiredPermissions={[route.requiredPermission]}
        >
          {route.element}
        </ProtectedRoute>
      ) : (
        route.element
      );

      return {
        ...route,
        key: route.path || index,
        element,
        children,
      };
    })
    .filter(Boolean) as AppRoute[];
}


export const routeConfig: AppRoute[] = [
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "", element: <div>Auth Home</div> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
  {
    path: "/",
    element: <ProtectedWrapper />,
    children: [
      {
        element: <NavWrapper />,
        children: [
          { path: "/dashboard", element: <div>dashboard</div>, title: "Dashboard", showInSidebar: true, icon: Home },

          { path: ADMIN_USER, element: <Users />, requiredPermission: "view_list_user", title: "Usuarios", showInSidebar: true, icon: UsersIcon },
          { path: USER_CREATE, element: <CreateForm />, requiredPermission: "create_user" },
          { path: USER_UPDATE, element: <UserUpdate />, requiredPermission: "update_user" },

          {
            path: ADMIN_OFFER, element: <Offers />, requiredPermission: "view_list_offer", title: "Ofertas", showInSidebar: true, icon: BookOpen
          },
          { path: OFFER_CREATE, element: <OfferCreateForm />, requiredPermission: "create_offer" },
          { path: OFFER_UPDATE, element: <OfferUpdate />, requiredPermission: "update_offer" },
        ],
      },
    ],
  },
  { path: "/403", element: <NoPermission /> },
  { path: "*", element: <div>404 Not Found</div> },
];
