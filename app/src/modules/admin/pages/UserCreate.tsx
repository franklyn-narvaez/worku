import { GET_COLLEGE, GET_ROLE } from "@/constants/path";
import { useAuth } from "@/hooks/useAuth";
import type { College, Role } from "@prisma/client";
import { useEffect, useState } from 'react'
import CreateForm from "../components/CreateForm";

function UserCreate() {

    const { createAuthFetchOptions } = useAuth();

    const [colleges, setColleges] = useState<College[] | undefined>(undefined);
    const [roles, setRoles] = useState<Role[] | undefined>(undefined);

    useEffect(() => {
        const fetchColleges = async () => {
            const options = await createAuthFetchOptions();
            const res = await fetch(GET_COLLEGE, options);
            const data = await res.json();
            setColleges(data);
        };
        fetchColleges();
    }, [createAuthFetchOptions]);

    useEffect(() => {
        const fetchRoles = async () => {
            const options = await createAuthFetchOptions();
            const res = await fetch(GET_ROLE, options);
            const data = await res.json();
            setRoles(data);
        };
        fetchRoles();
    }, [createAuthFetchOptions]);

    if (!colleges || !roles) {
        return <div>Loading...</div>;
    }

    return (
        <CreateForm colleges={colleges} roles={roles} />
    )
}

export default UserCreate;