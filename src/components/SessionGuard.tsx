"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SessionGuard({ children }: { children: React.ReactNode }) {
    const { data: session, status, update } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated" && session) {
            const expires = new Date(session.expires).getTime();
            const now = new Date().getTime();
            if (now > expires) {
                router.push("/auth/login");
                router.refresh();
            }
        }
        if (status === "unauthenticated") {
            router.push("/auth/login");
            router.refresh();
        }

    }, [status, session, router]);

    useEffect(() => {
        const interval = setInterval(() => update(), 1000 * 10); // Update session every 10 seconds
        return () => clearInterval(interval)
    }, [update])

    return <>{children}</>;
}
