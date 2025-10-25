'use client';

import { STUDENT_OFFER } from '@/constants/path';
import { useAuth } from '@/hooks/useAuth';
import type { Offer } from '@prisma/client';
import { useEffect, useState } from 'react';
import { FormOffer } from './FormOffer';

type ExtendedOffer = Offer & {
	college: {
		id: string;
		name: string;
	} | null;
	faculty: {
		id: string;
		name: string;
	} | null;
	userApplicationStatus?: 'SENT' | 'UNDER_REVIEW' | 'CALLED_FOR_INTERVIEW' | 'PENDING' | 'APPROVED' | 'REJECTED' | null;
};

const ListOffers = () => {
	const { createAuthFetchOptions } = useAuth();

	const [offers, setOffers] = useState<ExtendedOffer[]>([]);

	useEffect(() => {
		const fetchOffers = async () => {
			try {
				const fetchOptions = await createAuthFetchOptions();
				const res = await fetch(STUDENT_OFFER, fetchOptions);
				const data = await res.json();
				setOffers(Array.isArray(data) ? data : []);
			} catch (error) {
				setOffers([]);
			}
		};
		fetchOffers();
	}, [createAuthFetchOptions]);

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6">Ofertas</h1>
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{offers.length > 0 && offers.map(offer => <FormOffer offer={offer} key={offer.id} />)}
				{offers.length == 0 && <p>No hay ofertas disponibles</p>}
			</div>
		</div>
	);
};

export default ListOffers;
