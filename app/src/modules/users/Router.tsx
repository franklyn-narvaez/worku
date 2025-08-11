import { Route, Routes } from 'react-router-dom';
import Users from './pages/Users';
import CreateForm from './components/CreateForm';
import UserUpdate from './pages/UserUpdate';

function UserRouter() {
    return (
        <Routes>
            <Route path="" element={<Users />} />
            <Route path="create" element={<CreateForm />} />
            <Route path="update/:id" element={<UserUpdate />} />
            <Route path="*" element={<div>Not Found</div>} />
        </Routes>
    )
}

export default UserRouter;