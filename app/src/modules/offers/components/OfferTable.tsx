import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { OFFER_UPDATE } from '@/constants/path'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, NotebookText } from 'lucide-react';
import OfferModal from './OfferDetails'
import type { ExtendedOffer } from '../types/offer'
import TablePagination from '@/components/TablePagination';

const OfferTable = ({ offers }: { offers: ExtendedOffer[] }) => {
	const navigate = useNavigate()
	const [selectedOffer, setSelectedOffer] = useState<ExtendedOffer | null>(null)
	const [openModal, setOpenModal] = useState(false)

	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 10
	const totalPages = Math.ceil(offers.length / itemsPerPage)
	const startIndex = (currentPage - 1) * itemsPerPage
	const currentOffers = offers.slice(startIndex, startIndex + itemsPerPage)

	const handleEdit = (id: string) => navigate(OFFER_UPDATE.replace(':id', id))

	const handleView = (offer: ExtendedOffer) => {
		setSelectedOffer(offer)
		setOpenModal(true)
	}

	return (
		<>
			<Table className="table-auto w-full">
				<TableHeader className="bg-header-table">
					<TableRow>
						<TableHead>Título</TableHead>
						<TableHead>Escuela</TableHead>
						<TableHead>Fecha de creación</TableHead>
						<TableHead>Fecha de actualización</TableHead>
						<TableHead>Fecha de cierre</TableHead>
						<TableHead>Estado</TableHead>
						<TableHead>Acciones</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{currentOffers.map(offer => (
						<TableRow key={offer.id} className="bg-white border-b hover:bg-gray-300">
							<TableCell className="p-4 max-w-[200px] truncate">{offer.title}</TableCell>
							<TableCell className="p-4">{offer.college?.name ?? 'Sin escuela'}</TableCell>
							<TableCell className="p-4">{new Date(offer.createdAt).toLocaleDateString()}</TableCell>
							<TableCell className="p-4">{new Date(offer.updatedAt).toLocaleDateString()}</TableCell>
							<TableCell className="p-4">{new Date(offer.closeDate).toLocaleDateString()}</TableCell>
							<TableCell className="p-4">
								{offer.status ? <Badge variant="success">Activa</Badge> : <Badge variant="destructive">Inactiva</Badge>}
							</TableCell>
							<TableCell className="text-right flex space-x-2 p-4">
								<Button
									variant="outline"
									size="sm"
									className="text-gray-600 border-blue-200 hover:bg-gray-100 hover:text-black"
									onClick={() => handleEdit(offer.id)}
								>
									<Edit className="w-4 h-4 mr-2" />
									Editar
								</Button>
								<Button
									variant="outline"
									size="sm"
									className="text-gray-600 border-blue-200 hover:bg-gray-100 hover:text-black"
									onClick={() => handleView(offer)}
								>
									<NotebookText className="w-4 h-4 mr-2" />
									Detalles
								</Button>
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

			<OfferModal
				open={openModal}
				onClose={() => setOpenModal(false)}
				offer={selectedOffer}
			/>
		</>
	)
}

export default OfferTable
