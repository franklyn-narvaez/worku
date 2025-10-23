import { LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function LogOutButton() {
	const { logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async (e: React.MouseEvent) => {
		e.preventDefault();
		await logout()
			.then(() => {
				navigate('/auth/login');
			})
			.catch(() => {
				toast.error('Error al cerrar sesión');
			});
	};
	return (
		<button
			type="button"
			className="flex items-center gap-2 text-slate-600 hover:text-slate-900 cursor-pointer p-4 border-t border-slate-200"
			onClick={handleLogout}
		>
			<LogOut size={20} />
			<span>Cerrar sesión</span>
		</button>
	);
}

export default LogOutButton;
