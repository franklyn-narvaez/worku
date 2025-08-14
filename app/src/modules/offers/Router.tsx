import { Route, Routes } from 'react-router-dom';
import Offers from './pages/Offers';
import CreateForm from './components/CreateForm';

function OfferRouter() {
    return (
        <Routes>
            <Route path="" element={<Offers />} />
            <Route path="*" element={<div>Not Found</div>} />
            <Route path="create" element={<CreateForm />} />
        </Routes>
    )
}

export default OfferRouter;