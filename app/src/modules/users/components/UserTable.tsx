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
import type { User } from "@prisma/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { statusLabels } from "../schemas/Update";

type ExtendedUser = User & {
    college: {
        id: string;
        name: string;
    } | null
};

const UserTable = () => {

    const navigate = useNavigate();

    const [users, setUsers] = useState<ExtendedUser[]>([]);

    const handleEdit = (id: string) => {
        navigate(USER_UPDATE.replace(':id', id));
    }

    useEffect(() => {
        fetch("http://localhost:3000/api/user")
            .then((res) => res.json())
            .then((data) => setUsers(data));
    }, []);

    return (
        <Table>
            <TableCaption>Lista de usuarios</TableCaption>
            <TableHeader className="bg-slate-100 border-b">
                <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Apellido</TableHead>
                    <TableHead>Correo</TableHead>
                    <TableHead>Escuela</TableHead>
                    <TableHead>Fecha de creacion</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                </TableRow >
            </TableHeader >
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.id} className="border-b hover:bg-slate-50">
                        <TableCell className="p-4">{user.name}</TableCell>
                        <TableCell className="p-4">{user.lastName}</TableCell>
                        <TableCell className="p-4">{user.email}</TableCell>
                        <TableCell className="p-4">{user.college?.name ?? "Sin escuela"}</TableCell>
                        <TableCell className="p-4">{new Date(user.createdDate).toLocaleDateString()}</TableCell>
                        <TableCell className="p-4">{statusLabels[user.status]}</TableCell>
                        <TableCell className="p-4 text-right">
                            <button onClick={() => handleEdit(user.id)} className="text-blue-500 hover:underline">Editar</button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table >
    )
}

export default UserTable