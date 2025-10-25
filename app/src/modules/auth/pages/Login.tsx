import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import LoginForm from '../components/LoginForm';

function Login() {
	const { status } = useAuth();

	if (status === 'unresolved') {
		return <div>Loading...</div>;
	}

	if (status === 'authenticated') {
		return <Navigate to="/dashboard" />;
	}

	return <LoginForm />;
}

export default Login;
