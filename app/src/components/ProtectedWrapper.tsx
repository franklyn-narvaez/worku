import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { UserDataProvider } from "@/hooks/useUserData";

function ProtectedWrapper() {
    const { status } = useAuth();

    if (status === 'unresolved') {
        return <div>Loading...</div>;
    }

    if (status === 'unauthenticated') {
        return <Navigate to="/auth/login" />;
    }

    return (
        <UserDataProvider>
            <Outlet />
        </UserDataProvider>
    )
}

export default ProtectedWrapper;