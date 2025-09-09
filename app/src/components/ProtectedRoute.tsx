import { Navigate, Outlet } from "react-router-dom";
import { useUserData } from "@/hooks/useUserData";

type ProtectedProps = {
    requiredPermissions?: string[];
};

export function ProtectedRoute({ requiredPermissions = [] }: ProtectedProps) {
    const { userData, loading } = useUserData();
    const permissions = userData?.role?.permission?.map(rp => rp.permission.code) || [];

    if (loading) return <div>Loading...</div>;

    if (
        requiredPermissions.length > 0 &&
        !requiredPermissions.every((p) => permissions.includes(p))
    ) {
        return <Navigate to="/403" replace />;
    }

    return <Outlet />;
}
