import { Navigate } from 'react-router-dom';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '../../../hooks/useAuth';
import LoginForm from '../components/LoginForm';

function Login() {
	const { status, user } = useAuth();

	if (status === 'unresolved') {
		return <LoadingSpinner text="Cargando ofertas..." />;
	}

	if (status === 'authenticated' && user) {
		switch (user.role.name) {
			case 'Administrador':
				return <Navigate to="/admin/users" />;
			case 'Estudiante':
				return <Navigate to="/student/offers" />;
			case 'Dependencia':
				return <Navigate to="/dependence/reports" />;
			case 'Director':
				return <Navigate to="/director/reports" />;
			default:
				return <Navigate to="/dashboard" />;
		}
	}

	return <LoginForm />;
}

export default Login;
