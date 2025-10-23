import { Link } from 'react-router-dom';

function Navbar() {
	return (
		<nav className="flex justify-between items-center bg-slate-800 text-white px-24 py-3 sticky top-0 z-50">
			<h1 className="text-xl font-bold">WorkU</h1>
			<ul className="flex gap-4">
				<li>
					<Link to="/auth">Inicio</Link>
				</li>
				<li>
					<Link to="/auth/login">Iniciar sesión</Link>
				</li>
				<li>
					<Link to="/auth/register">Registrar</Link>
				</li>
			</ul>
		</nav>
	);
}

export default Navbar;
