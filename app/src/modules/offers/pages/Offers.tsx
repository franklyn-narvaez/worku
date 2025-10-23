import { useNavigate } from 'react-router-dom';
import OfferTable from '../components/OfferTable';

export default function Offers() {
	const navigate = useNavigate();
	const handleNavigate = () => {
		navigate('/admin/offers/create');
	};
	return (
		<div className="p-6 gap-4">
			<div className="flex justify-between items-center pb-2">
				<button
					type="button"
					onClick={handleNavigate}
					className="bg-black text-white px-2 py-1.5 rounded-md hover:bg-gray-800 transition"
				>
					Crear oferta
				</button>
			</div>
			<OfferTable />
		</div>
	);
}
