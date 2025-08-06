import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthLayout from './components/AuthLayout';
import Login from './modules/auth/pages/Login';
import Register from './modules/auth/pages/Register';
import ProtectedWrapper from '@components/ProtectedWrapper';
import { lazy } from 'react';
import UserRouter from './modules/users/Router';

const NavWrapper = lazy(() => import('./components/NavWrapper'));

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ProtectedWrapper />}>
                    <Route path="" element={<NavWrapper />} >
                        <Route path="/admin/dashboard" element={<div>About Page</div>} />
                        <Route path="/admin/users/*" element={<UserRouter />} />
                        <Route path="/admin/offers" element={<div>Offers Page</div>} />
                    </Route>
                </Route>

                <Route path='/auth' element={<AuthLayout />}>
                    <Route path='' element={<div>Auth Home</div>} />
                    <Route path='login' element={<Login />} />
                    <Route path='register' element={<Register />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Router;