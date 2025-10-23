import { Route, Routes } from 'react-router-dom';
import Offers from './pages/Offers';
import OfferCreateForm from './components/OfferCreateForm';
import OfferUpdate from './pages/OfferUpdate';
import { CREATE } from '@/constants/path';

function OfferRouter() {
	return (
		<Routes>
			<Route path="" element={<Offers />} />
			<Route path="*" element={<div>Not Found</div>} />
			<Route path={CREATE} element={<OfferCreateForm />} />
			<Route path="update/:id" element={<OfferUpdate />} />
		</Routes>
	);
}

export default OfferRouter;
