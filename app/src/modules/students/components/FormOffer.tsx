import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { STUDENT_PROFILES, VIEW_PROFILE } from "@/constants/path";
import { useAuth } from "@/hooks/useAuth";
import type { Offer } from "@prisma/client";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


type ExtendedOffer = Offer & {
    college: {
        id: string;
        name: string;
    } | null;
    faculty: {
        id: string;
        name: string;
    } | null;
    userApplicationStatus?: "PENDING" | "APPROVED" | "REJECTED" | null;
};

type ApplyOfferType = {
    offerId: string;
};

const formatDate = (date: string | Date) =>
    new Date(date).toLocaleDateString("es-CO", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

export function FormOffer({ offer }: { offer: ExtendedOffer }) {
    const { createAuthFetchOptions } = useAuth();

    const navigate = useNavigate();

    const { register, handleSubmit, reset } = useForm<ApplyOfferType>();

    const alreadyApplied = !!offer.userApplicationStatus;

    const onSubmit: SubmitHandler<ApplyOfferType> = async (data) => {
        try {
            const authOptions = await createAuthFetchOptions();

            const studentProfile = await fetch(
                VIEW_PROFILE,
                authOptions
            );

            if (!studentProfile.ok) {
                toast.warn("Debes completar tu perfil antes de aplicar a una oferta.");
                navigate(STUDENT_PROFILES);
                return;
            }

            const response = await fetch(
                `http://localhost:3000/api/student-offers/${data.offerId}/apply`,
                {
                    ...authOptions,
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(authOptions.headers || {}),
                    },
                    body: JSON.stringify(data),
                }
            );

            if (response.ok) {
                toast.success("¡Aplicaste correctamente a esta oferta!");
                reset();
            } else {
                const errorData = await response.json();
                toast.warn(errorData.error || "Error al aplicar a la oferta");
            }
        } catch (error) {
            console.error("Error en la aplicación:", error);
            toast.error("Error de conexión al aplicar a la oferta");
        }
    };

    return (
        <div>
            <form
                onSubmit={handleSubmit(onSubmit)}
            >
                <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-slate-200">
                    {/* Header */}
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <CardTitle className="text-xl font-semibold">
                                    {offer.title}
                                </CardTitle>
                                <Badge
                                    className={
                                        offer.userApplicationStatus === "PENDING"
                                            ? "bg-yellow-400"
                                            : offer.userApplicationStatus === "APPROVED"
                                                ? "bg-green-500"
                                                : offer.userApplicationStatus === "REJECTED"
                                                    ? "bg-red-500"
                                                    : "bg-gray-300"
                                    }
                                >
                                    {offer.userApplicationStatus === "PENDING" && "Pendiente"}
                                    {offer.userApplicationStatus === "APPROVED" && "Aprobada"}
                                    {offer.userApplicationStatus === "REJECTED" && "Rechazada"}
                                    {!offer.userApplicationStatus && "No aplicado"}
                                </Badge>
                            </div>

                            <Badge
                                variant={offer.status ? "default" : "secondary"}
                                className={offer.status ? "bg-green-500" : "bg-red-400"}
                            >
                                {offer.status ? "Activa" : "Inactiva"}
                            </Badge>

                        </div>

                        <p className="text-sm text-slate-500">
                            Publicada: {formatDate(offer.createdAt)}
                        </p>
                    </CardHeader>

                    {/* Content */}
                    <CardContent className="space-y-4">
                        <p className="text-slate-700 line-clamp-3">
                            {offer.description || "Sin descripción"}
                        </p>

                        {offer.requirements && (
                            <div>
                                <h4 className="text-sm font-semibold text-slate-600 mb-1">
                                    Requisitos:
                                </h4>
                                <p className="text-sm text-slate-700 line-clamp-2">
                                    {offer.requirements}
                                </p>
                            </div>
                        )}

                        <div className="flex flex-col gap-1 text-sm text-slate-600">
                            <p>
                                <span className="font-medium">Escuela: </span>
                                {offer.college?.name ?? "No especificada"}
                            </p>
                            <p>
                                <span className="font-medium">Facultad: </span>
                                {offer.faculty?.name ?? "No especificada"}
                            </p>
                        </div>

                        <p className="text-xs text-slate-500">
                            Fecha de cierre: {formatDate(offer.closeDate)}
                        </p>

                        {/* Campo oculto para enviar el ID */}
                        <input
                            type="hidden"
                            value={offer.id}
                            {...register("offerId")}
                        />

                        <div className="pt-2">
                            <Button
                                type="submit"
                                variant="outline"
                                className="w-full"
                                disabled={!offer.status || alreadyApplied}
                            >
                                {
                                    alreadyApplied
                                        ? "Ya has aplicado"
                                        : offer.status
                                            ? "Aplicar a la oferta"
                                            : "Oferta cerrada"
                                }
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    )
}