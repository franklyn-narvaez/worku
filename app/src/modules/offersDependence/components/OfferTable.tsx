"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { API_BASE_URL, DEPENDENCE_APPLICANTS, DEPENDENCE_OFFER_UPDATE } from "@/constants/path";
import { useAuth } from "@/hooks/useAuth";
import type { Offer } from "@prisma/client";
import { Edit, MoreHorizontal, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


type ExtendedOffer = Offer & {
    college: {
        id: string;
        name: string;
    } | null;
    _count: {
        Application: number;
    };
};

const OfferTable = () => {

    const { createAuthFetchOptions } = useAuth();

    const navigate = useNavigate();

    const [offers, setOffers] = useState<ExtendedOffer[]>([]);

    const handleEdit = (id: string) => {
        navigate(DEPENDENCE_OFFER_UPDATE.replace(':id', id));
    }

    const handleViewApplicants = (id: string) => {
        navigate(DEPENDENCE_APPLICANTS.replace(':id', id));
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
                    <TableHead>Aplicantes</TableHead>
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
                        <TableCell className="p-4">{offer._count.Application ?? 0}</TableCell>
                        <TableCell className="p-4">{offer.status ? <Badge variant="success">Activa</Badge> : <Badge variant="destructive">Inactiva</Badge>}</TableCell>

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
                                            <Edit className="w-4 h-4 mr-2" /> Editar
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="justify-start text-blue-600 hover:bg-slate-50"
                                            onClick={() => handleViewApplicants(offer.id)}
                                        >
                                            <Users className="w-4 h-4 mr-2" /> Ver aplicantes
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table >
    )
}

export default OfferTable