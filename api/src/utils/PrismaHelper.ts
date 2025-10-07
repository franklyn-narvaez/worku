export function buildNestedCreate<T>(data?: T[]) {
	return data && data.length > 0 ? { create: data } : undefined;
}
