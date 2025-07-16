import NextAuth from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import {prisma} from "@/libs/db";
import bcrypt from 'bcrypt';

export const authOptions = {
    session: {
        maxAge: 10,
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "Email" },
                password: { label: "Password", type: "password", placeholder: "Password" }
            },
            async authorize(credentials, req) {
                if (!credentials) {
                    return null;
                }
                const userFound = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })
                if (!userFound) throw new Error("Usuario o contraseña no válidos");

                const matchPasasword = await bcrypt.compare(credentials.password, userFound.password)

                if(!matchPasasword) throw new Error("Contraseña incorrecta");
                
                return{
                    id: userFound.id,
                    name: userFound.name,
                    email: userFound.email,
                }
            }
        })
    ],
    
    pages: {
        signIn: '/auth/login',
    },
}
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };