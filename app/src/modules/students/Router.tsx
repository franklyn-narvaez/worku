import { Route, Routes } from 'react-router-dom';

function StudentRouter() {
    return (
        <Routes>
            <Route path="*" element={<div>Not Found</div>} />
        </Routes>
    )
}

export default StudentRouter;