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
import type { User } from "@prisma/client";
import { useEffect, useState } from "react";


const UserTable = () => {

    const [users, setUsers] = useState<User[]>([]);

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
                    <TableHead>Fecha de creacion</TableHead>
                    <TableHead>Estado</TableHead>
                </TableRow >
            </TableHeader >
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.id} className="border-b hover:bg-slate-50">
                        <TableCell className="p-4">{user.name}</TableCell>
                        <TableCell className="p-4">{user.lastName}</TableCell>
                        <TableCell className="p-4">{user.email}</TableCell>
                        <TableCell className="p-4">{new Date(user.createdDate).toLocaleDateString()}</TableCell>
                        <TableCell className="p-4">{user.status ? "Activo" : "Inactivo"}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table >
    )
}

export default UserTable