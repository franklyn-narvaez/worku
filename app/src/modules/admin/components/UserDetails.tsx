import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Mail, UserCog, GraduationCap, CalendarDays, RefreshCcw, ShieldCheck } from 'lucide-react'
import { statusLabels } from '../schemas/Update'
import type { ExtendedUser } from '../types/user'

interface UserModalProps {
    open: boolean
    onClose: () => void
    user: ExtendedUser | null
}

const UserModal = ({ open, onClose, user }: UserModalProps) => {
    if (!user) return null

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-full !max-w-lg pt-10 max-h-[90vh] overflow-y-auto break-words">
                <div className="space-y-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {user.name} {user.lastName}
                            </h2>
                            <div className="flex items-center text-gray-600 mt-1 text-sm">
                                <ShieldCheck className="w-4 h-4 mr-2" />
                                <span>ID: {user.id}</span>
                            </div>
                        </div>

                        <Badge
                            variant={user.status === 'ACTIVE' ? 'success' : 'destructive'}
                            className="text-xs px-3 py-1"
                        >
                            {statusLabels[user.status]}
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-start gap-2">
                            <Mail className="w-5 h-5 text-blue-500 mt-0.5" />
                            <div>
                                <p className="text-md text-gray-800">Correo electrónico</p>
                                <p className="font-medium text-gray-500">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2">
                            <UserCog className="w-5 h-5 text-purple-500 mt-0.5" />
                            <div>
                                <p className="text-md text-gray-800">Rol</p>
                                <p className="font-medium text-gray-500">{user.role?.name ?? 'Sin rol asignado'}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2">
                            <GraduationCap className="w-5 h-5 text-green-600 mt-0.5" />
                            <div>
                                <p className="text-md text-gray-800">Escuela</p>
                                <p className="font-medium text-gray-500">{user.college?.name ?? 'Sin escuela'}</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                        <div className="flex items-start gap-2">
                            <CalendarDays className="w-5 h-5 text-red-500 mt-0.5" />
                            <div>
                                <p className="text-md text-gray-500">Fecha de creación</p>
                                <p className="font-medium text-gray-800">
                                    {new Date(user.createdDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2">
                            <RefreshCcw className="w-5 h-5 text-purple-500 mt-0.5" />
                            <div>
                                <p className="text-md text-gray-500">Última actualización</p>
                                <p className="font-medium text-gray-800">
                                    {new Date(user.updatedDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end pt-6 border-t mt-4">
                    <Button variant="secondary" onClick={onClose}>
                        Cerrar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default UserModal
