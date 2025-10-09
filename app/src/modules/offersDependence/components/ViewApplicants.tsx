import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL, DEPENDENCE_OFFERS } from "@/constants/path";

type ApplicationStatus =
    | "UNDER_REVIEW"
    | "CALLED_FOR_INTERVIEW"
    | "APPROVED"
    | "REJECTED";

type Applicant = {
    applicationId: string;
    status: ApplicationStatus;
    appliedAt: string;
    user: {
        id: string;
        name: string;
        lastName: string;
        email: string;
        college?: {
            id: string;
            name: string;
            faculty?: { id: string; name: string } | null;
        } | null;
    };
};

type OfferApplicants = {
    offer: {
        id: string;
        title: string;
    };
    applicants: Applicant[];
};

const formatDate = (date: string | Date) =>
    new Date(date).toLocaleDateString("es-CO", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

export function ViewApplicants() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { createAuthFetchOptions } = useAuth();
    const [data, setData] = useState<OfferApplicants | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchApplicants = useCallback(async () => {
        try {
            const authOptions = await createAuthFetchOptions();
            const response = await fetch(
                `${API_BASE_URL}/offers-dependence/${id}/applicants`,
                authOptions
            );

            if (!response.ok) {
                const err = await response.json();
                toast.error(err.error || "Error al obtener los aplicantes");
                return;
            }

            const json = await response.json();
            setData(json);
        } catch (error) {
            console.error(error);
            toast.error("Error de conexión con el servidor");
        } finally {
            setLoading(false);
        }
    }, [createAuthFetchOptions, id]);

    useEffect(() => {
        fetchApplicants();
    }, [fetchApplicants]);

    const handleBack = () => {
        navigate(DEPENDENCE_OFFERS);
    };

    const handleStatusChange = async (
        applicationId: string,
        newStatus: ApplicationStatus
    ) => {
        try {
            const authOptions = await createAuthFetchOptions();
            const response = await fetch(
                `${API_BASE_URL}/offers-dependence/${applicationId}/status`,
                {
                    ...authOptions,
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        ...(authOptions.headers || {}),
                    },
                    body: JSON.stringify({ status: newStatus }),
                }
            );

            if (!response.ok) {
                const error = await response.json();
                toast.error(error.error || "Error al actualizar la aplicación");
                return;
            }

            const updatedApp = await response.json();
            toast.success(`Estado actualizado a ${newStatus === "UNDER_REVIEW" ? "En revisión" : newStatus === "CALLED_FOR_INTERVIEW" ? "Citado a entrevista" : newStatus === "APPROVED" ? "Aprobado" : "Rechazado"}`);

            setData((prev) =>
                prev
                    ? {
                        ...prev,
                        applicants: prev.applicants.map((app) =>
                            app.applicationId === updatedApp.id
                                ? { ...app, status: updatedApp.status }
                                : app
                        ),
                    }
                    : prev
            );
        } catch (error) {
            console.error(error);
            toast.error("Error de conexión al actualizar estado");
        }
    };

    const getStatusLabel = (status: ApplicationStatus) => {
        switch (status) {
            case "UNDER_REVIEW":
                return "En revisión";
            case "CALLED_FOR_INTERVIEW":
                return "Citado a entrevista";
            case "APPROVED":
                return "Aprobado";
            case "REJECTED":
                return "Rechazado";
            default:
                return "Desconocido";
        }
    };

    const getStatusColor = (status: ApplicationStatus) => {
        switch (status) {
            case "UNDER_REVIEW":
                return "bg-yellow-400";
            case "CALLED_FOR_INTERVIEW":
                return "bg-indigo-400";
            case "APPROVED":
                return "bg-green-500";
            case "REJECTED":
                return "bg-red-500";
            default:
                return "bg-gray-400";
        }
    };

    if (loading) {
        return (
            <div className="mt-6 space-y-4 text-center">
                <Button
                    variant="outline"
                    onClick={handleBack}
                    className="border-slate-300 hover:bg-slate-100"
                >
                    ← Volver a ofertas
                </Button>
                <p className="text-slate-500 mt-4">Cargando aplicantes...</p>
            </div>
        );
    }

    if (!data || !data.applicants || data.applicants.length === 0) {
        return (
            <div className="mt-6 space-y-4">
                <Button
                    variant="outline"
                    onClick={handleBack}
                    className="border-slate-300 hover:bg-slate-100"
                >
                    ← Volver a ofertas
                </Button>

                <Card className="shadow-sm border border-slate-200">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-slate-700">
                            Aplicantes para: {data?.offer?.title ?? "Oferta sin título"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-500 text-sm">No hay aplicantes registrados.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-4 mt-6">
            <Button
                variant="outline"
                onClick={handleBack}
                className="border-slate-300 hover:bg-slate-100"
            >
                ← Volver a ofertas
            </Button>
            <Card className="border border-slate-200 shadow-sm">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-semibold">
                            Aplicantes para: {data.offer.title}
                        </CardTitle>
                        <Badge variant="secondary">
                            {data.applicants.length} aplicante
                            {data.applicants.length > 1 && "s"}
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="space-y-3">
                    {data.applicants.map((applicant) => (
                        <div
                            key={applicant.applicationId}
                            className="border border-slate-300 bg-white shadow-md rounded-xl p-4"
                        >
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
                                <div className="flex flex-col text-md">
                                    <p className="font-semibold text-slate-800 flex items-center gap-1">
                                        👤 {applicant.user.name} {applicant.user.lastName}
                                    </p>
                                    <p className="text-slate-600 text-sm flex items-center gap-1 mt-1">
                                        ✉️ {applicant.user.email}
                                    </p>
                                    <p className="text-slate-600 text-sm flex items-center gap-1 mt-1">
                                        🏫 {applicant.user.college?.faculty?.name ?? "Facultad no especificada"} - {applicant.user.college?.name ?? "Escuela no especificada"}
                                    </p>
                                    <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                                        📅 Aplicó el {formatDate(applicant.appliedAt)}
                                    </p>
                                </div>

                                <div className="flex flex-col items-end mt-3 sm:mt-0">
                                    <Badge className={`${getStatusColor(applicant.status)} text-white mb-2`}>
                                        {getStatusLabel(applicant.status)}
                                    </Badge>

                                    <div className="flex flex-wrap justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                handleStatusChange(applicant.applicationId, "UNDER_REVIEW")
                                            }
                                            className="border-yellow-400 text-yellow-600 hover:bg-yellow-50"
                                        >
                                            En revisión
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                handleStatusChange(applicant.applicationId, "CALLED_FOR_INTERVIEW")
                                            }
                                            className="border-indigo-400 text-indigo-600 hover:bg-indigo-50"
                                        >
                                            Entrevista
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                handleStatusChange(applicant.applicationId, "APPROVED")
                                            }
                                            className="border-green-500 text-green-600 hover:bg-green-50"
                                        >
                                            Aprobar
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                handleStatusChange(applicant.applicationId, "REJECTED")
                                            }
                                            className="border-red-500 text-red-600 hover:bg-red-50"
                                        >
                                            Rechazar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
