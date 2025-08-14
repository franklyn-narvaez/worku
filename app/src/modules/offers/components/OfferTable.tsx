"use client";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { USER_UPDATE } from "@/constants/path";
import type { Offer } from "@prisma/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


type ExtendedOffer = Offer & {
    college: {
        id: string;
        name: string;
    } | null
};

const OfferTable = () => {

    const navigate = useNavigate();

    const [offers, setOffers] = useState<ExtendedOffer[]>([]);

    const handleEdit = (id: string) => {
        navigate(USER_UPDATE.replace(':id', id));
    }

    useEffect(() => {
        fetch("http://localhost:3000/api/offer")
            .then((res) => res.json())
            .then((data) => setOffers(data));
    }, []);

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
                </TableRow >
            </TableHeader >
            <TableBody>
                {offers.map((offer) => (
                    <TableRow key={offer.id} className="border-b hover:bg-slate-50">
                        <TableCell className="p-4">{offer.title}</TableCell>
                        <TableCell className="p-4">{offer.description}</TableCell>
                        <TableCell className="p-4">{offer.requirements}</TableCell>
                        <TableCell className="p-4">{offer.college?.name ?? "Sin escuela"}</TableCell>
                        <TableCell className="p-4">{new Date(offer.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="p-4">{new Date(offer.updatedAt).toLocaleDateString()}</TableCell>
                        <TableCell className="p-4">{new Date(offer.closeDate).toLocaleDateString()}</TableCell>
                        <TableCell className="p-4">{offer.status ? "Activa" : "Inactiva"}</TableCell>
                        <TableCell className="p-4 text-right">
                            <button onClick={() => handleEdit(offer.id)} className="text-blue-500 hover:underline">Editar</button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table >
    )
}

export default OfferTable