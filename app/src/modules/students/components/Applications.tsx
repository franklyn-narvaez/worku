"use client";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import type { Application } from "@prisma/client";
import { API_BASE_URL } from "@/constants/path";

type ExtendedApplication = Application & {
    offer: {
        id: string;
        title: string;
        description: string;
        closeDate: string;
    };
};

const MyApplications = () => {
    const { createAuthFetchOptions } = useAuth();
    const [applications, setApplications] = useState<ExtendedApplication[]>([]);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const fetchOptions = await createAuthFetchOptions();
                const res = await fetch(`${API_BASE_URL}/student-offers/applications`, fetchOptions);
                const data = await res.json();
                setApplications(data);
            } catch (error) {
                console.error("Error fetching applications:", error);
            }
        };

        fetchApplications();
    }, [createAuthFetchOptions]);

    const formatStatus = (status: ExtendedApplication["status"]) => {
        switch (status) {
            case "SENT":
                return "Enviada";
            case "UNDER_REVIEW":
                return "En revisión";
            case "CALLED_FOR_INTERVIEW":
                return "Citad@ a entrevista";
            case "PENDING":
                return "Pendiente";
            case "APPROVED":
                return "Aprobada";
            case "REJECTED":
                return "Rechazada";
            default:
                return "Desconocido";
        }
    };

    const getStatusColor = (status: ExtendedApplication["status"]) => {
        switch (status) {
            case "SENT":
                return "bg-blue-400";
            case "UNDER_REVIEW":
                return "bg-purple-500";
            case "CALLED_FOR_INTERVIEW":
                return "bg-indigo-500";
            case "PENDING":
                return "bg-yellow-400";
            case "APPROVED":
                return "bg-green-500";
            case "REJECTED":
                return "bg-red-500";
            default:
                return "bg-gray-400";
        }
    };

    return (
        <Table>
            <TableCaption>Lista de aplicaciones realizadas</TableCaption>
            <TableHeader className="bg-slate-100 border-b">
                <TableRow>
                    <TableHead>Titulo</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Fecha de aplicación</TableHead>
                    <TableHead>Fecha de cierre</TableHead>
                    <TableHead>Estado</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {applications.map((application) => (
                    <TableRow key={application.id} className="border-b hover:bg-slate-50">
                        <TableCell className="p-4">{application.offer.title}</TableCell>
                        <TableCell className="p-4 line-clamp-2">
                            {application.offer.description || "Sin descripción"}
                        </TableCell>
                        <TableCell className="p-4">
                            {new Date(application.appliedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="p-4">
                            {new Date(application.offer.closeDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="p-4">
                            <span
                                className={`px-2 py-1 rounded text-white text-xs font-medium ${getStatusColor(
                                    application.status
                                )}`}
                            >
                                {formatStatus(application.status)}
                            </span>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default MyApplications;
