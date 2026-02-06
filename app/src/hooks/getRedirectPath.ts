export function getRedirectPath(role: string, permissions: string[]): string {
	// Administrador
	if (role === 'ADMIN') {
		return '/admin/users';
	}

	// Dependencia
	if (role === 'DEPENDENCE') {
		return '/dependence/applications';
	}

	// Estudiante
	if (role === 'STUDENT') {
		return '/offers';
	}

	// Si algo falla o no tiene permisos
	return '/unauthorized';
}
