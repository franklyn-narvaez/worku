import React from 'react'
import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

async function Navbar() {

    const sesion = await getServerSession(authOptions);

    return (
        <nav className="flex justify-between items-center bg-slate-800 text-white px-24 py-3 sticky top-0 z-50">
            <h1 className='text-xl font-bold'>
                WorkU
            </h1>
            <ul className='flex gap-4'>
                {
                    !sesion?.user ? (
                        <>
                            <li>
                                <Link href='/'>
                                    Inicio
                                </Link>
                            </li>
                            <li>
                                <Link href='/auth/login'>
                                    Iniciar sesión
                                </Link>
                            </li>
                            <li>
                                <Link href='/auth/register'>
                                    Registrar
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link href='/admin/dashboard'>
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href='/api/auth/signout'>
                                    Cerrar sesión
                                </Link>
                            </li>
                        </>
                    )
                }
            </ul>
        </nav>
    )
}

export default Navbar