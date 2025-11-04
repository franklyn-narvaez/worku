import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, GraduationCap } from 'lucide-react';
import type { Offer } from '@prisma/client';
import clsx from 'clsx';

type ExtendedOffer = Offer & {
    college: { id: string; name: string } | null;
    faculty: { id: string; name: string } | null;
    userApplicationStatus?: 'SENT' | 'UNDER_REVIEW' | 'CALLED_FOR_INTERVIEW' | 'PENDING' | 'APPROVED' | 'REJECTED' | null;
    interviewDate?: Date | null;
    attendedInterview?: boolean | null;
};

interface StudentOfferDetailsProps {
    open: boolean;
    onClose: () => void;
    offer: ExtendedOffer | null;
}

const formatDate = (date: string | Date) =>
    new Date(date).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

const StudentOfferDetails = ({ open, onClose, offer }: StudentOfferDetailsProps) => {
    if (!offer) return null;

    const steps = [
        { key: 'SENT', label: 'Aplicación enviada', color: 'bg-blue-400' },
        { key: 'UNDER_REVIEW', label: 'En revisión', color: 'bg-purple-500' },
        { key: 'CALLED_FOR_INTERVIEW', label: 'Cit. entrevista', color: 'bg-indigo-500' },
        { key: 'APPROVED', label: 'Aprobada', color: 'bg-green-500' },
        { key: 'REJECTED', label: 'Rechazada', color: 'bg-red-500' },
    ];

    const currentIndex = steps.findIndex(s => s.key === offer.userApplicationStatus);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-full !max-w-3xl pt-10 max-h-[90vh] overflow-y-auto break-words">
                <div className="space-y-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{offer.title}</h2>
                            <div className="flex items-center text-gray-600 mt-1 text-sm">
                                <GraduationCap className="w-4 h-4 mr-2" />
                                <span>{offer.college?.name ?? 'Sin escuela'}</span>
                            </div>
                            {offer.faculty && (
                                <p className="text-sm text-gray-500">Facultad: {offer.faculty.name}</p>
                            )}
                        </div>

                        <Badge className={offer.status ? 'bg-green-500' : 'bg-red-400'}>
                            {offer.status ? 'Activa' : 'Inactiva'}
                        </Badge>
                    </div>


                    <div>
                        <h3 className="text-sm font-semibold text-gray-800 mb-1">Descripción</h3>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {offer.description || 'Sin descripción disponible.'}
                        </p>
                    </div>

                    {offer.requirements && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-800 mb-1">Requisitos</h3>
                            <p className="text-gray-700 whitespace-pre-line">{offer.requirements}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-1 gap-3 pt-4 border-t border-gray-100">
                        <div className="flex items-start gap-2">
                            <CalendarDays className="w-5 h-5 text-red-500 mt-0.5" />
                            <div>
                                <p className="text-xs text-gray-500">Fecha de cierre</p>
                                <p className="font-medium text-gray-800">{formatDate(offer.closeDate)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative flex items-center justify-between w-full px-2 py-6">
                    <div className="absolute top-1/2 left-4 right-4 h-[3px] bg-gray-300 -translate-y-1/2" />
                    {steps.map((step, index) => {
                        const active = index <= currentIndex && currentIndex !== -1;
                        return (
                            <div key={step.key} className="relative z-10 flex flex-col items-center text-center">
                                <div
                                    className={clsx(
                                        'w-6 h-6 rounded-full border-2 border-gray-400 flex items-center justify-center transition-colors duration-300',
                                        active ? `${step.color} border-transparent` : 'bg-gray-200'
                                    )}
                                />
                                <p
                                    className={clsx(
                                        'text-[11px] mt-2 max-w-[80px]',
                                        active ? 'text-gray-800 font-medium' : 'text-gray-400'
                                    )}
                                >
                                    {step.label}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-end pt-4">
                    <Button variant="secondary" onClick={onClose}>
                        Cerrar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default StudentOfferDetails;
