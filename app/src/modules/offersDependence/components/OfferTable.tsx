"use client";

import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { DEPENDENCE_OFFER_UPDATE } from "@/constants/path";
import { useAuth } from "@/hooks/useAuth";
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

    const { createAuthFetchOptions } = useAuth();

    const navigate = useNavigate();

    const [offers, setOffers] = useState<ExtendedOffer[]>([]);

    const handleEdit = (id: string) => {
        navigate(DEPENDENCE_OFFER_UPDATE.replace(':id', id));
    }

    useEffect(() => {
        const fetchUsers = async () => {
            const fetchOptions = await createAuthFetchOptions();
            const res = await fetch("http://localhost:3000/api/offers-dependence", fetchOptions);
            const data = await res.json();
            setOffers(data);
        };
        fetchUsers();
    }, [createAuthFetchOptions]);

    return (
        <Table>
            <TableCaption>Lista de ofertas</TableCaption>
            <TableHeader className="bg-slate-100 border-b">
                <TableRow>
                    <TableHead>Titulo</TableHead>
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
                        <TableCell className="p-4">{offer.college?.name ?? "Sin escuela"}</TableCell>
                        <TableCell className="p-4">{new Date(offer.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="p-4">{new Date(offer.updatedAt).toLocaleDateString()}</TableCell>
                        <TableCell className="p-4">{new Date(offer.closeDate).toLocaleDateString()}</TableCell>
                        <TableCell className="p-4">{offer.status ? <Badge variant="success">Activa</Badge> : <Badge variant="destructive">Inactiva</Badge>}</TableCell>
                        <TableCell className="p-4 text-right">
                            <button type="button" onClick={() => handleEdit(offer.id)} className="text-blue-500 hover:underline">Editar</button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table >
    )
}

export default OfferTable