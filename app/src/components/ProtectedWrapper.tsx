import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function ProtectedWrapper() {
    const { status } = useAuth();

    if (status === 'unresolved') {
        return <div>Loading...</div>;
    }

    if (status === 'unauthenticated') {
        return <Navigate to="/auth/login" />;
    }

    return (
        <Outlet />
    )
}

export default ProtectedWrapper;