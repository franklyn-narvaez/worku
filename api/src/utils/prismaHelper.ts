export function buildNestedCreate<T>(data?: T[]) {
	return data && data.length > 0 ? { create: data } : undefined;
}

export function getDatabaseUrl () {
	const mode = process.env.MODE;
	if (mode === "test") {
		return process.env.DATABASE_URL_TEST;
	}
	if (mode === "dev") {
		return process.env.DATABASE_URL_DEV;
	}
	return process.env.DATABASE_URL;
};
