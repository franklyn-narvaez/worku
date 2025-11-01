import { Dialog, DialogContent } from '@/components/ui/dialog'
import { CalendarDays, Clock, RefreshCcw, GraduationCap, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { ExtendedOffer } from '../types/offer'

interface OfferModalProps {
    open: boolean
    onClose: () => void
    offer: ExtendedOffer | null
}

const OfferModal = ({ open, onClose, offer }: OfferModalProps) => {
    if (!offer) return null

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
                        </div>

                        {offer.status ? (
                            <Badge variant="success" className="text-xs px-3 py-1">Abierta</Badge>
                        ) : (
                            <Badge variant="destructive" className="text-xs px-3 py-1">Cerrada</Badge>
                        )}
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-800 mb-1">DESCRIPCIÓN</h3>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {offer.description || 'Sin descripción disponible.'}
                        </p>
                    </div>

                    {offer.requirements && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-800 mb-1 flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2 text-gray-700" /> REQUISITOS
                            </h3>
                            <p className="text-gray-700 whitespace-pre-line">{offer.requirements}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-gray-100">
                        <div className="flex items-start gap-2">
                            <CalendarDays className="w-5 h-5 text-red-500 mt-0.5" />
                            <div>
                                <p className="text-xs text-gray-500">Fecha de Cierre</p>
                                <p className="font-medium text-gray-800">
                                    {new Date(offer.closeDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2">
                            <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
                            <div>
                                <p className="text-xs text-gray-500">Creación</p>
                                <p className="font-medium text-gray-800">
                                    {new Date(offer.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2">
                            <RefreshCcw className="w-5 h-5 text-purple-500 mt-0.5" />
                            <div>
                                <p className="text-xs text-gray-500">Actualización</p>
                                <p className="font-medium text-gray-800">
                                    {new Date(offer.updatedAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button variant="secondary" onClick={onClose}>
                        Cerrar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default OfferModal
