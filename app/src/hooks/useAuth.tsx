import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContext>({
	login: async () => ({ status: 500 }),
	logout: async () => {},
	refresh: async () => ({}),
	status: "unresolved",
	createAuthFetchOptions: async () => ({}) as RequestInit,
});

type AuthContext = {
	login: (
		email: string,
		password: string,
	) => Promise<{ status: number; data?: any }>;
	logout: () => Promise<void>;
	refresh: () => Promise<any>;
	status: Status;
	createAuthFetchOptions: () => Promise<RequestInit>;
};

type Status = "authenticated" | "unresolved" | "unauthenticated";

const AUTH_CONFIG = {
	msRefreshBeforeExpires: 30000, // 30 seconds
	credentials: "include" as RequestCredentials,
};

type AccessTokenData = {
	access_token?: string;
	expires?: number;
};

type ExtendedV1AccessTokenData = AccessTokenData & {
	expires_at?: number;
};

export interface AuthenticationStorage {
	get: () =>
		| Promise<ExtendedV1AccessTokenData | null>
		| ExtendedV1AccessTokenData
		| null;
	set: (value: ExtendedV1AccessTokenData | null) => Promise<void> | void;
}

const memoryStorage = () => {
	let store: AccessTokenData | null = null;

	return {
		get: async () => store,
		set: async (value: AccessTokenData | null) => {
			store = value;
		},
	} as AuthenticationStorage;
};

async function loginRequest(
	data: { email: string; password: string },
	options: RequestInit,
) {
	const response = await fetch("http://localhost:3000/api/auth/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
		...options,
	});
	// Si la respuesta trae contenido JSON
	let responseData = null;
	try {
		responseData = await response.json();
	} catch {
		responseData = null; // Evita romper si no hay JSON en la respuesta
	}
	// 🔹 Nunca lanzamos error, devolvemos siempre el status
	return {
		status: response.status,
		ok: response.ok,
		data: responseData,
	};
}

async function logOutRequest(options: RequestInit) {
	const response = await fetch("http://localhost:3000/api/auth/logout", {
		method: "POST",
		...options,
	});
	if (!response.ok) {
		throw new Error("Logout failed");
	}
	return { status: response.status, data: await response.json() };
}

async function refreshRequest(options: RequestInit) {
	const response = await fetch("http://localhost:3000/api/auth/refresh", {
		method: "POST",
		...options,
	});
	if (!response.ok) {
		return { status: response.status, data: await response.json() };
	}
	return { status: response.status, data: await response.json() };
}

const storage: AuthenticationStorage = memoryStorage();

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [status, setStatus] = useState<Status>("unresolved");
	let refreshPromise: Promise<AccessTokenData> | null = null;
	let refreshTimeout: ReturnType<typeof setTimeout> | null = null;

	const resetStorage = () => {
		storage.set({
			access_token: undefined,
			expires: undefined,
			expires_at: undefined,
		});
	};

	const setCredentials = (data: ExtendedV1AccessTokenData) => {
		const expires = data.expires ?? 0;
		data.expires_at = Date.now() + expires;
		storage.set(data);

		if (
			expires > AUTH_CONFIG.msRefreshBeforeExpires &&
			expires < Number.MAX_SAFE_INTEGER
		) {
			if (refreshTimeout) clearTimeout(refreshTimeout);

			refreshTimeout = setTimeout(() => {
				refreshTimeout = null;

				refresh().catch((_err) => {
					/* throw err; */
				});
			}, expires - AUTH_CONFIG.msRefreshBeforeExpires);
		}
	};

	const refresh = async () => {
		if (refreshPromise) {
			return refreshPromise; // Evitar solicitudes duplicadas
		}

		refreshPromise = (async () => {
			const fetchOptions: RequestInit = {
				credentials: AUTH_CONFIG.credentials,
			};

			const response = await refreshRequest(fetchOptions);

			if (response.status === 401) {
				setStatus("unauthenticated");
				resetStorage();
				refreshPromise = null; // Limpiar la promesa
				throw response.data;
			}

			setCredentials(response.data);
			if (status === "unresolved") setStatus("authenticated");

			refreshPromise = null; // Limpiar la promesa después de completar
			return response.data;
		})();

		return refreshPromise;
	};

	const login = async (email: string, password: string) => {
		resetStorage();

		const fetchOptions: RequestInit = {
			credentials: AUTH_CONFIG.credentials,
		};

		const response = await loginRequest({ email, password }, fetchOptions);

		if (response.status === 200) {
			setStatus("authenticated");
			setCredentials(response.data);
		}

		return response;
	};

	const logout = async () => {
		const fetchOptions = await createAuthFetchOptions();

		const response = await logOutRequest(fetchOptions);

		if (response.status === 401) {
			throw response.data;
		}

		if (refreshTimeout) clearTimeout(refreshTimeout);
		resetStorage();
		setStatus("unauthenticated");
	};

	const createAuthFetchOptions = async () => {
		const authData = await storage.get();

		const fetchOptions: RequestInit = {
			credentials: AUTH_CONFIG.credentials,
			headers: {
				Authorization: `Bearer ${authData?.access_token}`,
			},
		};

		return fetchOptions;
	};

	useEffect(() => {
		refresh();

		const interval = setInterval(
			() => {
				refresh().catch(() => setStatus("unauthenticated"));
			},
			25 * 60 * 1000,
		);

		return () => clearInterval(interval);
	});

	return (
		<AuthContext.Provider
			value={{ login, logout, refresh, status, createAuthFetchOptions }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
