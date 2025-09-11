
import AuthLayout from "@/components/AuthLayout";
import NoPermission from "@/components/NoPermission";

import { ADMIN_OFFER, ADMIN_USER, OFFER_CREATE, OFFER_UPDATE, USER_CREATE, USER_UPDATE } from "@/constants/path";
import CreateForm from "@/modules/admin/components/CreateForm";
import Users from "@/modules/admin/pages/Users";
import UserUpdate from "@/modules/admin/pages/UserUpdate";
import Login from "@/modules/auth/pages/Login";
import Register from "@/modules/auth/pages/Register";
import Offers from "@/modules/offers/pages/Offers";
import OfferUpdate from "@/modules/offers/pages/OfferUpdate";

export function allowdNavigateRoute(permissions: string[]) {
  return routeConfig
    .filter(
      (route) => !route.requiredPermission || permissions.includes(route.requiredPermission)
    )
    .map((route) => ({
      path: route.path,
      element: route.element,
      children: route.children || [],
    }));
}

export const routeConfig = [
  {
    path: "/auth",
    element: <AuthLayout />, // Layout base para autenticación
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
  // Rutas de Admin
  {
    path: `/admin/dashboard`,
    element: <div>Admin Dashboard</div>,
  },
  {
    path: ADMIN_USER,
    requiredPermission: "view_list_user",
    element: <Users />
  },
  {
    path: ADMIN_OFFER,
    requiredPermission: "view_list_offer",
    element: <Offers />
  },
  {
    path: USER_CREATE,
    requiredPermission: "create_user",
    element: <CreateForm />
  },
  {
    path: USER_UPDATE,
    requiredPermission: "update_user",
    element: <UserUpdate />
  },
  {
    path: OFFER_CREATE,
    requiredPermission: "create_offer",
    element: <CreateForm />,
  },
  {
    path: OFFER_UPDATE,
    requiredPermission: "update_offer",
    element: <OfferUpdate />,
  },

  // Rutas de Student
  {
    path: `/student`,
    requiredPermission: "view_offer",
  },

  // Ruta para 403
  {
    path: "/403",
    element: <NoPermission />,
  },
];

