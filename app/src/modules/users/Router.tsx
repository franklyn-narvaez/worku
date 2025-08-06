import { Route, Routes } from 'react-router-dom';
import Users from './pages/Users';
import CreateForm from './components/CreateForm';

function UserRouter() {
    return (
        <Routes>
            <Route path="" element={<Users />} />
            <Route path="create" element={<CreateForm />} />
        </Routes>
    )
}

export default UserRouter;