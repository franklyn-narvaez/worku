import type { Offer } from '@prisma/client';
import { useEffect, useMemo, useState } from 'react';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';
import { STUDENT_OFFER } from '@/constants/path';
import { useAuth } from '@/hooks/useAuth';
import { FormOffer } from './FormOffer';

type ExtendedOffer = Offer & {
	college: { id: string; name: string } | null;
	faculty: { id: string; name: string } | null;
	userApplicationStatus?: 'SENT' | 'UNDER_REVIEW' | 'CALLED_FOR_INTERVIEW' | 'PENDING' | 'APPROVED' | 'REJECTED' | null;
};

const normalize = (text: string) =>
	text
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '');

const ListOffers = () => {
	const { createAuthFetchOptions } = useAuth();
	const [offers, setOffers] = useState<ExtendedOffer[]>([]);
	const [search, setSearch] = useState('');
	const [currentPage, setCurrentPage] = useState(1);

	const offersPerPage = 6;

	const filteredOffers = useMemo(() => {
		if (!offers) return [];

		const query = normalize(search.trim());

		return offers.filter(offer => {
			const title = normalize(offer.title);
			const college = normalize(offer.college?.name ?? '');
			const faculty = normalize(offer.faculty?.name ?? '');
			const status = offer.status ? 'activa' : 'inactiva';
			const description = normalize(offer.description ?? '');
			const requirements = normalize(offer.requirements ?? '');

			return (
				title.includes(query) ||
				college.includes(query) ||
				faculty.includes(query) ||
				status.includes(query) ||
				description.includes(query) ||
				requirements.includes(query)
			);
		});
	}, [offers, search]);

	const indexOfLastOffer = currentPage * offersPerPage;
	const indexOfFirstOffer = indexOfLastOffer - offersPerPage;
	const currentOffers = filteredOffers.slice(indexOfFirstOffer, indexOfLastOffer);

	const totalPages = Math.ceil(filteredOffers.length / offersPerPage);

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
			<div className="mb-6">
				<input
					type="text"
					placeholder="Buscar por título, escuela, facultad o estado..."
					value={search}
					onChange={e => {
						setSearch(e.target.value);
						setCurrentPage(1);
					}}
					className="bg-white border border-blue-300 rounded-md px-3 py-2 w-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{currentOffers.length > 0 ? (
					currentOffers.map(offer => <FormOffer offer={offer} key={offer.id} />)
				) : (
					<p className="col-span-full text-center text-gray-500 font-medium">No hay ofertas disponibles</p>
				)}
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

						{Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
							<PaginationItem key={page}>
								<PaginationLink href="#" onClick={() => handlePageChange(page)} isActive={page === currentPage}>
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
