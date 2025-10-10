import { CREATE_USER } from "@/constants/path";
import type { CreateType } from "../schemas/Create";

export async function createUser(data:CreateType,authOptions: RequestInit) {
     const fetchOptions = {
                ...authOptions,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(authOptions.headers || {}),
                },
                body: JSON.stringify(data),
            };
    
    return await fetch(CREATE_USER, fetchOptions);
}