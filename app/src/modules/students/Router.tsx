import { Route, Routes } from 'react-router-dom';
import StudentsOffers from './pages/StudentsOffers';
import MyApplications from './components/Applications';

function StudentRouter() {
    return (
        <Routes>
            <Route path="" element={<StudentsOffers />} />
            <Route path="*" element={<div>Not Found</div>} />
            <Route path="applications" element={<MyApplications />} />
        </Routes>
    )
}

export default StudentRouter;