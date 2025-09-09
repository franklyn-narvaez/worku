import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthLayout from './components/AuthLayout';
import Login from './modules/auth/pages/Login';
import Register from './modules/auth/pages/Register';
import ProtectedWrapper from '@components/ProtectedWrapper';
import { lazy } from 'react';
import AdminRouter from './modules/admin/Router';
import OfferRouter from './modules/offers/Router';
import { BASE_OFFER, BASE_USER } from './constants/path';
import { ProtectedRoute } from './components/ProtectedRoute';
import NoPermission from './components/NoPermission';
import { adminPermissions } from './constants/permissions';

const NavWrapper = lazy(() => import('./components/NavWrapper'));

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ProtectedWrapper />}>
                    <Route path='/' element={<ProtectedRoute requiredPermissions={adminPermissions} />}>
                        <Route path="" element={<NavWrapper />} >
                            <Route path="/admin/dashboard" element={<div>About Page</div>} />
                            <Route path={`${BASE_USER}/*`} element={<AdminRouter />} />
                            <Route path={`${BASE_OFFER}/*`} element={<OfferRouter />} />
                        </Route>
                    </Route>
                </Route>

                <Route path='/auth' element={<AuthLayout />}>
                    <Route path='' element={<div>Auth Home</div>} />
                    <Route path='login' element={<Login />} />
                    <Route path='register' element={<Register />} />
                </Route>

                <Route path="*" element={<div>404 Not Found</div>} />
                <Route path="/403" element={<NoPermission />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Router;