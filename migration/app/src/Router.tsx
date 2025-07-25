import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthLayout from './components/AuthLayout';
import Login from './modules/auth/pages/Login';
import Register from './modules/auth/pages/Register';
import ProtectedWrapper from '@components/ProtectedWrapper';

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ProtectedWrapper />}>
                    <Route path="/admin/dashboard" element={<div>About Page</div>} />
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