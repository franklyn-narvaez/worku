import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DEPENDENCE_APPLICANTS, DEPENDENCE_OFFER_DETAILS, DEPENDENCE_OFFER_UPDATE } from '@/constants/path';
import { Edit, MoreHorizontal, Users, NotebookText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ExtendedOffer } from '../types/offer';
import TablePagination from '@/components/TablePagination';
import { useState } from 'react';

const OfferTable = (props: { offers: ExtendedOffer[] }) => {
	const navigate = useNavigate();

	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 10
	const totalPages = Math.ceil(props.offers.length / itemsPerPage)
	const startIndex = (currentPage - 1) * itemsPerPage
	const currentOffers = props.offers.slice(startIndex, startIndex + itemsPerPage)

	const handleEdit = (id: string) => {
		navigate(DEPENDENCE_OFFER_UPDATE.replace(':id', id));
	};

	const handleViewApplicants = (id: string) => {
		navigate(DEPENDENCE_APPLICANTS.replace(':id', id));
	};

	const handleViewOfferDetails = (id: string) => {
		navigate(DEPENDENCE_OFFER_DETAILS.replace(':id', id));
	};

	return (
		<>
			<Table>
				<TableCaption>Lista de ofertas</TableCaption>
				<TableHeader className="bg-header-table">
					<TableRow>
						<TableHead>Titulo</TableHead>
						<TableHead>Escuela</TableHead>
						<TableHead>Fecha de creacion</TableHead>
						<TableHead>Fecha de actualizacion</TableHead>
						<TableHead>Fecha de cierre</TableHead>
						<TableHead>Aplicantes</TableHead>
						<TableHead>Estado</TableHead>
						<TableHead className="text-right">Acciones</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{currentOffers.map(offer => (
						<TableRow key={offer.id} className="bg-white border-b hover:bg-gray-300">
							<TableCell className="p-4">{offer.title}</TableCell>
							<TableCell className="p-4">{offer.college?.name ?? 'Sin escuela'}</TableCell>
							<TableCell className="p-4">{new Date(offer.createdAt).toLocaleDateString()}</TableCell>
							<TableCell className="p-4">{new Date(offer.updatedAt).toLocaleDateString()}</TableCell>
							<TableCell className="p-4">{new Date(offer.closeDate).toLocaleDateString()}</TableCell>
							<TableCell className="p-4">{offer._count.Application ?? 0}</TableCell>
							<TableCell className="p-4">
								{offer.status ? <Badge variant="success">Activa</Badge> : <Badge variant="destructive">Inactiva</Badge>}
							</TableCell>

							<TableCell className="text-right">
								<Popover>
									<PopoverTrigger asChild>
										<Button variant="ghost" size="icon" className="hover:bg-slate-100">
											<MoreHorizontal className="h-5 w-5" />
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-40">
										<div className="flex flex-col space-y-2">
											<Button
												variant="ghost"
												size="sm"
												className="justify-start text-blue-600 hover:bg-blue-50"
												onClick={() => handleEdit(offer.id)}
											>
												<Edit className="w-4 h-4 mr-2" />
												Editar
											</Button>
											<Button
												variant="ghost"
												size="sm"
												className="justify-start text-blue-600 hover:bg-slate-50"
												onClick={() => handleViewApplicants(offer.id)}
											>
												<Users className="w-4 h-4 mr-2" /> Ver aplicantes
											</Button>
											<Button
												variant="ghost"
												size="sm"
												className="justify-start text-blue-600 hover:bg-slate-50"
												onClick={() => handleViewOfferDetails(offer.id)}
											>
												<NotebookText className="w-4 h-4 mr-2" /> Ver detalles
											</Button>
										</div>
									</PopoverContent>
								</Popover>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<div className="mt-4">
				<TablePagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={setCurrentPage}
				/>
			</div>
		</>
	);
};

export default OfferTable;
