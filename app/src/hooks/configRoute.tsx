import AuthLayout from '@/components/AuthLayout';
import NavWrapper from '@/components/NavWrapper';
import NoPermission from '@/components/NoPermission';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import ProtectedWrapper from '@/components/ProtectedWrapper';

import {
	ADMIN_OFFER,
	ADMIN_USER,
	DEPENDENCE_APPLICANTS,
	DEPENDENCE_APPLICANTS_DETAILS,
	DEPENDENCE_OFFER_CREATE,
	DEPENDENCE_OFFER_DETAILS,
	DEPENDENCE_OFFER_UPDATE,
	DEPENDENCE_OFFERS,
	DIRECTOR_HISTORY_PROFILE,
	DIRECTOR_REVIEW_PROFILE,
	DIRECTOR_REVIEW_PROFILE_HISTORY,
	DIRECTOR_REVIEW_PROFILES,
	OFFER_CREATE,
	OFFER_UPDATE,
	STUDENT_APPLICATIONS,
	STUDENT_OFFERS,
	STUDENT_PROFILES,
	USER_CREATE,
	USER_UPDATE,
} from '@/constants/path';
import CreateForm from '@/modules/admin/components/CreateForm';
import Users from '@/modules/admin/pages/Users';
import UserUpdate from '@/modules/admin/pages/UserUpdate';
import Login from '@/modules/auth/pages/Login';
import RegisterPage from '@/modules/auth/pages/Register';
import ReviewProfileHistory from '@/modules/director/components/ReviewProfileHistory';
import ReviewProfilesLists from '@/modules/director/components/ReviewProfilesLists';
import StudentReviewProfileHistory from '@/modules/director/components/StudentReviewProfileHistory';
import StudentReviewProfileView from '@/modules/director/components/StudentReviewProfileView';
import OfferCreateForm from '@/modules/offers/components/OfferCreateForm';
import Offers from '@/modules/offers/pages/Offers';
import OfferUpdate from '@/modules/offers/pages/OfferUpdate';
import OfferCreateFormDependence from '@/modules/offersDependence/components/OfferCreateFormDependence';
import StudentProfileView from '@/modules/offersDependence/components/StudentProfileView';
import { ViewApplicants } from '@/modules/offersDependence/components/ViewApplicants';
import ViewOfferDetails from '@/modules/offersDependence/components/ViewOfferDetails';
import OffersDependence from '@/modules/offersDependence/pages/OffersDependence';
import OfferUpdateDependence from '@/modules/offersDependence/pages/OfferUpdateDependence';
import MyApplications from '@/modules/students/components/Applications';
import ProfileForm from '@/modules/students/components/ProfileForm';
import StudentOffers from '@/modules/students/pages/StudentsOffers';
import { BookOpen, Home, Users as UsersIcon } from 'lucide-react';
import type { ComponentType, ReactElement } from 'react';

export type AppRoute = {
	path?: string;
	element: ReactElement;
	children?: AppRoute[];
	requiredPermission?: string;
	title?: string;
	showInSidebar?: boolean;
	icon?: ComponentType;
};

export function allowdNavigateRoute(permissions: string[], routes: AppRoute[] = routeConfig): AppRoute[] {
	return routes
		.map((route, index) => {
			const children = route.children ? allowdNavigateRoute(permissions, route.children) : undefined;

			const element = route.requiredPermission ? (
				<ProtectedRoute key={route.path || index} requiredPermissions={[route.requiredPermission]}>
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
		path: '/auth',
		element: <AuthLayout />,
		children: [
			{ path: '', element: <div>Auth Home</div> },
			{ path: 'login', element: <Login /> },
			{ path: 'register', element: <RegisterPage /> },
		],
	},
	{
		path: '/',
		element: <ProtectedWrapper />,
		children: [
			{
				element: <NavWrapper />,
				children: [
					{
						path: '/dashboard',
						element: <div>dashboard</div>,
						title: 'Dashboard',
						showInSidebar: true,
						icon: Home,
					},

					{
						path: ADMIN_USER,
						element: <Users />,
						requiredPermission: 'view_list_user',
						title: 'Usuarios',
						showInSidebar: true,
						icon: UsersIcon,
					},
					{
						path: USER_CREATE,
						element: <CreateForm />,
						requiredPermission: 'create_user',
					},
					{
						path: USER_UPDATE,
						element: <UserUpdate />,
						requiredPermission: 'update_user',
					},

					{
						path: ADMIN_OFFER,
						element: <Offers />,
						requiredPermission: 'view_list_offer',
						title: 'Ofertas',
						showInSidebar: true,
						icon: BookOpen,
					},
					{
						path: OFFER_CREATE,
						element: <OfferCreateForm />,
						requiredPermission: 'create_offer',
					},
					{
						path: OFFER_UPDATE,
						element: <OfferUpdate />,
						requiredPermission: 'update_offer',
					},

					{
						path: DEPENDENCE_OFFERS,
						element: <OffersDependence />,
						requiredPermission: 'view_list_offer_dependence',
						title: 'Ofertas',
						showInSidebar: true,
						icon: BookOpen,
					},
					{
						path: DEPENDENCE_OFFER_CREATE,
						element: <OfferCreateFormDependence />,
						requiredPermission: 'create_offer_dependence',
					},
					{
						path: DEPENDENCE_OFFER_UPDATE,
						element: <OfferUpdateDependence />,
						requiredPermission: 'update_offer_dependence',
					},
					{
						path: DEPENDENCE_APPLICANTS,
						element: <ViewApplicants />,
						requiredPermission: 'view_applications_dependence',
					},
					{
						path: DEPENDENCE_OFFER_DETAILS,
						element: <ViewOfferDetails />,
						requiredPermission: 'view_applications_dependence',
					},
					{
						path: DEPENDENCE_APPLICANTS_DETAILS,
						element: <StudentProfileView />,
						requiredPermission: 'view_applications_dependence',
					},

					{
						path: DIRECTOR_REVIEW_PROFILES,
						element: <ReviewProfilesLists />,
						requiredPermission: 'review_profiles',
						title: 'Revisar Perfiles',
						showInSidebar: true,
						icon: BookOpen,
					},
					{
						path: DIRECTOR_REVIEW_PROFILE,
						element: <StudentReviewProfileView />,
						requiredPermission: 'review_profiles',
					},
					{
						path: DIRECTOR_REVIEW_PROFILE_HISTORY,
						element: <ReviewProfileHistory />,
						requiredPermission: 'review_profiles',
						title: 'Historial de Perfiles',
						showInSidebar: true,
						icon: BookOpen,
					},
					{
						path: DIRECTOR_HISTORY_PROFILE,
						element: <StudentReviewProfileHistory />,
						requiredPermission: 'review_profiles',
					},
					{
						path: STUDENT_OFFERS,
						element: <StudentOffers />,
						requiredPermission: 'view_offer',
						title: 'Ofertas Estudiantes',
						showInSidebar: true,
						icon: BookOpen,
					},
					{
						path: STUDENT_APPLICATIONS,
						element: <MyApplications />,
						requiredPermission: 'view_applications',
						title: 'Mis Aplicaciones',
						showInSidebar: true,
						icon: BookOpen,
					},
					{
						path: STUDENT_PROFILES,
						element: <ProfileForm />,
						requiredPermission: 'create_profile',
						title: 'Perfil',
						showInSidebar: true,
						icon: BookOpen,
					},
				],
			},
		],
	},
	{ path: '/403', element: <NoPermission /> },
	{ path: '*', element: <div>404 Not Found</div> },
];
