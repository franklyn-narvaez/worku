import { STUDENT_OFFER } from '@/constants/path';
import { useAuth } from '@/hooks/useAuth';
import type { Offer } from '@prisma/client';
import { useEffect, useState } from 'react';
import { FormOffer } from './FormOffer';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationPrevious,
	PaginationNext,
} from '@/components/ui/pagination';

type ExtendedOffer = Offer & {
	college: { id: string; name: string } | null;
	faculty: { id: string; name: string } | null;
	userApplicationStatus?:
	| 'SENT'
	| 'UNDER_REVIEW'
	| 'CALLED_FOR_INTERVIEW'
	| 'PENDING'
	| 'APPROVED'
	| 'REJECTED'
	| null;
};

const ListOffers = () => {
	const { createAuthFetchOptions } = useAuth();
	const [offers, setOffers] = useState<ExtendedOffer[]>([]);
	const [currentPage, setCurrentPage] = useState(1);

	const offersPerPage = 6;

	const indexOfLastOffer = currentPage * offersPerPage;
	const indexOfFirstOffer = indexOfLastOffer - offersPerPage;
	const currentOffers = offers.slice(indexOfFirstOffer, indexOfLastOffer);

	const totalPages = Math.ceil(offers.length / offersPerPage);

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

	const handlePageChange = (page: number) => {
		if (page < 1 || page > totalPages) return;
		setCurrentPage(page);
	};

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6">Ofertas</h1>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{currentOffers.length > 0 &&
					currentOffers.map((offer) => <FormOffer offer={offer} key={offer.id} />)}
				{currentOffers.length === 0 && <p>No hay ofertas disponibles</p>}
			</div>

			{totalPages > 1 && (
				<Pagination className="mt-8">
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								href="#"
								onClick={() => handlePageChange(currentPage - 1)}
								className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
							/>
						</PaginationItem>

						{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
							<PaginationItem key={page}>
								<PaginationLink
									href="#"
									onClick={() => handlePageChange(page)}
									isActive={page === currentPage}
								>
									{page}
								</PaginationLink>
							</PaginationItem>
						))}

						<PaginationItem>
							<PaginationNext
								href="#"
								onClick={() => handlePageChange(currentPage + 1)}
								className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			)}
		</div>
	);
};

export default ListOffers;
