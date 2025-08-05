import { Route, Routes } from 'react-router-dom';
import Users from '../pages/Users';

function UserRouter() {
    return (
        <Routes>
            <Route path="" element={<Users />} />
        </Routes>
    )
}

export default UserRouter;