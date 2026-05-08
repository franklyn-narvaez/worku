import { API_BASE_URL } from '@/constants/path';
import type { ForgotPasswordType } from '../schemas/forgot-password';
import type { ResetPasswordType } from '../schemas/reset-password';

export async function forgotPasswordRequest(data: ForgotPasswordType) {
	return await fetch(`${API_BASE_URL}/auth/forgot-password`, {
		method: 'POST',
		body: JSON.stringify({
			email: data.email,
		}),
		headers: {
			'Content-Type': 'application/json',
		},
	});
}

export async function validateResetToken(token: string) {
	return await fetch(`${API_BASE_URL}/auth/validate-reset-token`, {
		method: 'POST',
		body: JSON.stringify({ token }),
		headers: {
			'Content-Type': 'application/json',
		},
	});
}

export async function resetPasswordRequest(token: string, data: ResetPasswordType) {
	return await fetch(`${API_BASE_URL}/auth/reset-password`, {
		method: 'POST',
		body: JSON.stringify({
			token,
			password: data.password,
			passwordConfirm: data.passwordConfirm,
		}),
		headers: {
			'Content-Type': 'application/json',
		},
	});
}
