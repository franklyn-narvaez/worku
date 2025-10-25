import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { OFFER_UPDATE } from '@/constants/path';
import { useNavigate } from 'react-router-dom';
import type { ExtendedOffer } from '../types/offer';

const OfferTable = (props: { offers: ExtendedOffer[] }) => {
	const navigate = useNavigate();

	const handleEdit = (id: string) => {
		navigate(OFFER_UPDATE.replace(':id', id));
	};

	return (
		<Table>
			<TableCaption>Lista de ofertas</TableCaption>
			<TableHeader className="bg-slate-100 border-b">
				<TableRow>
					<TableHead>Titulo</TableHead>
					<TableHead>Descripcion</TableHead>
					<TableHead>Requisitos</TableHead>
					<TableHead>Escuela</TableHead>
					<TableHead>Fecha de creacion</TableHead>
					<TableHead>Fecha de actualizacion</TableHead>
					<TableHead>Fecha de cierre</TableHead>
					<TableHead>Estado</TableHead>
					<TableHead className="text-right">Acciones</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{props.offers.map(offer => (
					<TableRow key={offer.id} className="border-b hover:bg-slate-50">
						<TableCell className="p-4">{offer.title}</TableCell>
						<TableCell className="p-4">{offer.description}</TableCell>
						<TableCell className="p-4">{offer.requirements}</TableCell>
						<TableCell className="p-4">{offer.college?.name ?? 'Sin escuela'}</TableCell>
						<TableCell className="p-4">{new Date(offer.createdAt).toLocaleDateString()}</TableCell>
						<TableCell className="p-4">{new Date(offer.updatedAt).toLocaleDateString()}</TableCell>
						<TableCell className="p-4">{new Date(offer.closeDate).toLocaleDateString()}</TableCell>
						<TableCell className="p-4">{offer.status ? 'Activa' : 'Inactiva'}</TableCell>
						<TableCell className="p-4 text-right">
							<button type="button" onClick={() => handleEdit(offer.id)} className="text-blue-500 hover:underline">
								Editar
							</button>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

export default OfferTable;
