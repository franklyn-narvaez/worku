import { createContext, useContext, useEffect, useState } from "react";
import type { User, Permission } from "@prisma/client";
import { GET_ME } from "@/constants/path";
import { useAuth } from "./useAuth";

export type RoleWithPermissions = {
    id: string;
    permission: {
        permission: Permission;
    }[];
};

export type ExtendedUser = User & {
    role: RoleWithPermissions;
};

const UserDataContext = createContext<UserDataContext>({
    userData: null,
    setUserData: () => { },
    loading: true,
})

type UserDataContext = {
    userData: ExtendedUser | null;
    setUserData: (data: ExtendedUser | null) => void;
    loading: boolean;
}

export const UserDataProvider = ({ children }: { children: React.ReactNode }) => {
    const [userData, setUserData] = useState<ExtendedUser | null>(null);
    const [loading, setLoading] = useState(true);
    const { createAuthFetchOptions } = useAuth();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const fetchOptions = await createAuthFetchOptions();
                const res = await fetch(GET_ME, {
                    ...fetchOptions,
                });
                if (res.ok) {
                    const data = await res.json();
                    setUserData(data);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchUserData();
    }, [createAuthFetchOptions]);

    return (
        <UserDataContext.Provider value={{ userData, setUserData, loading }}>
            {children}
        </UserDataContext.Provider>
    );
}

export function useUserData() {
    return useContext(UserDataContext);
}

