import { useAuth } from '@/hooks/useAuth';
import { LogOut, ShieldAlert, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NoPermission() {
    const { logout } = useAuth();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
            <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md text-center">
                <div className="flex justify-center mb-4">
                    <ShieldAlert className="text-red-500 w-16 h-16" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Acceso denegado
                </h1>
                <p className="text-gray-600 mb-6">
                    No tienes permisos para acceder a esta sección.
                </p>

                <div className="flex flex-col gap-3">
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
                    >
                        <Home className="w-5 h-5" />
                        <span>Ir al inicio</span>
                    </Link>

                    <button
                        type="button"
                        onClick={logout}
                        className="flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
                    >
                        <Link to="/auth/login" className="flex items-center gap-2"> <LogOut /> <span>Cerrar sesión</span> </Link>
                    </button>
                </div>
            </div>
        </div>
    );
}
