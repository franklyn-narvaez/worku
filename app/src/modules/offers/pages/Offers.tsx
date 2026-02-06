import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { API_BASE_URL } from '@/constants/path';
import { useAuth } from '@/hooks/useAuth';
import OfferTable from '../components/OfferTable';
import type { ExtendedOffer } from '../types/offer';

export default function Offers() {
	const navigate = useNavigate();
	const { createAuthFetchOptions } = useAuth();
	const [offers, setOffers] = useState<ExtendedOffer[] | undefined>(undefined);
	const [search, setSearch] = useState('');

	const handleNavigate = () => {
		navigate('/admin/offers/create');
	};

	useEffect(() => {
		const fetchOffers = async () => {
			const fetchOptions = await createAuthFetchOptions();
			const res = await fetch(`${API_BASE_URL}/offer`, fetchOptions);
			const data = await res.json();
			setOffers(data);
		};
		fetchOffers();
	}, [createAuthFetchOptions]);

	const filteredOffers = useMemo(() => {
		if (!offers) return [];

		const normalize = (text: string) =>
			text
				.toLowerCase()
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '');

		const query = normalize(search.trim());

		return offers.filter(offer => {
			const title = normalize(offer.title);
			const college = normalize(offer.college?.name ?? '');
			const status = offer.status ? 'activa' : 'inactiva';

			return !query || title.includes(query) || college.includes(query) || status.includes(query);
		});
	}, [offers, search]);

	if (!offers) {
		return <LoadingSpinner text="Cargando ofertas..." />;
	}

	return (
		<div className="p-6 gap-4">
			<div className="flex justify-between items-center pb-4">
				<button
					type="button"
					onClick={handleNavigate}
					className="bg-button-create text-white px-3 py-2 rounded-md hover:bg-gray-800 transition"
				>
					Crear oferta
				</button>
				<input
					type="text"
					placeholder="Buscar por título, escuela o estado..."
					value={search}
					onChange={e => setSearch(e.target.value)}
					className="bg-white border border-blue-300 rounded-md px-3 py-2 w-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<OfferTable offers={filteredOffers} />
		</div>
	);
}
