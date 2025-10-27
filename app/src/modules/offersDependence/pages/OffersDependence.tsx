import { useNavigate } from 'react-router-dom';
import OfferTable from '../components/OfferTable';
import { API_BASE_URL, DEPENDENCE_OFFER_CREATE } from '@/constants/path';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { ExtendedOffer } from '../types/offer';

export default function OffersDependence() {
	const { createAuthFetchOptions } = useAuth();
	const [offers, setOffers] = useState<ExtendedOffer[] | undefined>(undefined);

	const navigate = useNavigate();

	const handleNavigate = () => {
		navigate(DEPENDENCE_OFFER_CREATE);
	};

	useEffect(() => {
		const fetchUsers = async () => {
			const fetchOptions = await createAuthFetchOptions();
			const res = await fetch(`${API_BASE_URL}/offers-dependence`, fetchOptions);
			const data = await res.json();
			setOffers(data);
		};
		fetchUsers();
	}, [createAuthFetchOptions]);

	if (!offers) {
		return <div>Cargando...</div>;
	}

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
			<OfferTable offers={offers} />
		</div>
	);
}
